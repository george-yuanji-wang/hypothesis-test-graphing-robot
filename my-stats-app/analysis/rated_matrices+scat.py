import os, textwrap, pandas as pd, matplotlib.pyplot as plt
from scipy.stats import linregress

datasets = {
    'students': (
        'public/students.csv',
        "Oak Park High School Students:\nSophomore, Junior, Senior of 2024-2025"
    ),
    'residents': (
        'public/residents.csv',
        "Oak Park Residents"
    ),
    'combined': (
        'public/res+stu.csv',
        "Combination of Oak Park Residents\nand Oak Park High School Students:\nSophomore, Junior, Senior of 2024-2025"
    )
}

heat_cols = [
    'Q16: rate diet',
    'Q15: rate exercise',
    'Q17: rate sleep',
    'Q18: rate healthiness'
]
labels = {
    'Q16: rate diet':        'Rated Effect of Balanced\nDiet on Health',
    'Q15: rate exercise':    'Rated Effect of Regular\nExercise on Health',
    'Q17: rate sleep':       'Rated Effect of Sleep\non Health',
    'Q18: rate healthiness': 'Overall Self-Rated\nHealthiness'
}

comparisons = [
    ('Q16: rate diet',     'Q15: rate exercise'),     
    ('Q17: rate sleep',    'Q15: rate exercise'),    
    ('Q15: rate exercise', 'Q18: rate healthiness')  
]

point_colour = {
    ('Q16: rate diet','Q15: rate exercise'):          '#C23B21',  # red
    ('Q17: rate sleep','Q15: rate exercise'):         '#2E5895',  # blue
    ('Q15: rate exercise','Q18: rate healthiness'):   '#4C9F38'   # green
}
line_colour = {
    ('Q16: rate diet','Q15: rate exercise'):          '#9B2F1A',
    ('Q17: rate sleep','Q15: rate exercise'):         '#254677',
    ('Q15: rate exercise','Q18: rate healthiness'):   '#3E7C2F'
}

drop_t = ['Q17t: Q1 other','Q27t: others','Q37t: other']
q2 = ['Q2: asthma ppl','Q2: cancer ppl','Q2: diabetes ppl',
      'Q2: heart disease ppl','Q2: high blood pressure ppl','Q2: none','Q2: others']
q3 = ['Q3: asthma family history','Q3: cancer history','Q3: diabetes history',
      'Q3: heart disease history','Q3: high blood pressure history','Q3: no history','Q3: other history']

os.makedirs('plots', exist_ok=True)

for key, (csv_path, title) in datasets.items():
    df = pd.read_csv(csv_path)
    df.drop(columns=drop_t, inplace=True, errors='ignore')
    df['Q2_sum'] = df[q2].sum(axis=1)
    df['Q3_sum'] = df[q3].sum(axis=1)
    df.drop(columns=q2+q3, inplace=True, errors='ignore')

    sub = df[heat_cols].apply(pd.to_numeric, errors='coerce').dropna()
    corr = sub.corr(method='pearson')

    fig, ax = plt.subplots(figsize=(6,6), dpi=300)
    im = ax.imshow(corr, vmin=-1, vmax=1, cmap='RdBu')
    ax.set_xticks(range(4)); ax.set_yticks(range(4))
    ax.set_xticklabels([textwrap.fill(labels[c],20) for c in heat_cols],
                       rotation=45, ha='right', fontsize=8)
    ax.set_yticklabels([textwrap.fill(labels[c],20) for c in heat_cols], fontsize=8)
    for i in range(4):
        for j in range(4):
            ax.text(j, i, f'{corr.iat[i,j]:.2f}', ha='center', va='center', fontsize=8)
    fig.suptitle(title, fontsize=10, y=0.92)
    plt.subplots_adjust(top=0.90, left=0.22, right=0.78)
    cbar = fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
    cbar.ax.tick_params(labelsize=6)
    os.makedirs(f'plots/{key}', exist_ok=True)
    fig.savefig(f'plots/{key}/{key}_4x4_corr.png', bbox_inches='tight', dpi=300)
    plt.close(fig)

    fig, axes = plt.subplots(1, 3, figsize=(18,4), dpi=300)
    for ax, (xcol, ycol) in zip(axes, comparisons):
        xy = df[[xcol, ycol]].apply(pd.to_numeric, errors='coerce').dropna()
        if xy.empty:
            ax.set_visible(False)
            continue
        x, y = xy[xcol], xy[ycol]
        res = linregress(x, y)
        pc = point_colour[(xcol, ycol)]
        lc = line_colour[(xcol, ycol)]
        ax.scatter(x, y, s=20, color=pc)
        ax.plot(x, res.slope*x + res.intercept, color=lc, linewidth=1)
        ax.set_xlabel(textwrap.fill(labels[xcol],20), fontsize=8)
        ax.set_ylabel(textwrap.fill(labels[ycol],20), fontsize=8)
        ax.set_title(f"r={res.rvalue:.2f}, R²={res.rvalue**2:.2f}\n"
                     f"a={res.slope:.2f}, b={res.intercept:.2f}", fontsize=6)
        ax.tick_params(labelsize=6)

    fig.suptitle(textwrap.fill(title, 60), fontsize=10, y=0.94)
    plt.tight_layout()
    fig.savefig(f'plots/{key}/{key}_scatter_comparisons.png',
                bbox_inches='tight', dpi=300)
    plt.close(fig)

corr_mats = {}
for key, (csv_path, _) in datasets.items():
    df_tmp = pd.read_csv(csv_path)
    df_tmp.drop(columns=drop_t, inplace=True, errors='ignore')
    df_tmp['Q2_sum'] = df_tmp[q2].sum(axis=1)
    df_tmp['Q3_sum'] = df_tmp[q3].sum(axis=1)
    df_tmp.drop(columns=q2+q3, inplace=True, errors='ignore')
    corr_mats[key] = (
        df_tmp[heat_cols]
        .apply(pd.to_numeric, errors='coerce')
        .dropna()
        .corr(method='pearson')
    )






fig, axes = plt.subplots(1, 3, figsize=(30, 8), dpi=300)

for ax, (key, (_, ttl)) in zip(axes, datasets.items()):
    m = corr_mats[key]
    im = ax.imshow(m, vmin=-1, vmax=1, cmap='RdBu')
    ax.set_xticks(range(4)); ax.set_yticks(range(4))
    ax.set_xticklabels([textwrap.fill(labels[c], 20) for c in heat_cols],
                       rotation=45, ha='right', fontsize=10)
    ax.set_yticklabels([textwrap.fill(labels[c], 20) for c in heat_cols],
                       fontsize=10)
    for i in range(4):
        for j in range(4):
            ax.text(j, i, f'{m.iat[i, j]:.2f}',
                    ha='center', va='center', fontsize=12)
    ax.set_title(ttl, fontsize=10, pad=12)

plt.subplots_adjust(wspace=0.40, left=0.05, right=0.80, top=0.93, bottom=0.07)

cbar = fig.colorbar(im, ax=axes.ravel().tolist(),
                    fraction=0.03, pad=0.02, location='right')
cbar.ax.tick_params(labelsize=6)

fig.savefig('plots/all_datasets_4x4_corr.png',
            bbox_inches='tight', dpi=300)
plt.close(fig)
