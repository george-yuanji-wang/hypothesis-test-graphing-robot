import os, textwrap, pandas as pd, matplotlib.pyplot as plt, numpy as np
from scipy.stats import linregress
from matplotlib import cm, colors

datasets = {
    'students': ('public/students.csv',
                 "Oak Park High School Students: Sophomore, Junior, Senior of 2024-2025"),
    'residents': ('public/residents.csv',
                  "Oak Park Residents")
}

drop_t = ['Q17t: Q1 other','Q27t: others','Q37t: other']
q2 = ['Q2: asthma ppl','Q2: cancer ppl','Q2: diabetes ppl',
      'Q2: heart disease ppl','Q2: high blood pressure ppl','Q2: none','Q2: others']
q3 = ['Q3: asthma family history','Q3: cancer history','Q3: diabetes history',
      'Q3: heart disease history','Q3: high blood pressure history','Q3: no history','Q3: other history']

comparisons = [
    ('Q15: rate exercise','Q16: rate diet',  cm.Reds,   'exercise_vs_diet'),
    ('Q15: rate exercise','Q17: rate sleep', cm.Blues,  'exercise_vs_sleep'),
    ('Q16: rate diet',    'Q17: rate sleep', cm.Greens, 'diet_vs_sleep')
]

labels = {
    'Q15: rate exercise': 'Rated Effect of Regular\nExercise on Health',
    'Q16: rate diet':     'Rated Effect of Balanced\nDiet on Health',
    'Q17: rate sleep':    'Rated Effect of Sleep\non Health'
}
short_name = {
    'Q15: rate exercise': 'Exercise',
    'Q16: rate diet':     'Diet',
    'Q17: rate sleep':    'Sleep'
}

def trim(cmap):
    trimmed = colors.ListedColormap(cmap(np.linspace(0.35, 1, 256)))
    trimmed.set_under('#eeeeee')
    return trimmed

os.makedirs('plots', exist_ok=True)

for key, (csv_path, _) in datasets.items():
    df = pd.read_csv(csv_path)
    df.drop(columns=drop_t, inplace=True, errors='ignore')
    df['Q2_sum'] = df[q2].sum(axis=1)
    df['Q3_sum'] = df[q3].sum(axis=1)
    df.drop(columns=q2+q3, inplace=True, errors='ignore')
    df = df.apply(pd.to_numeric, errors='coerce')

    # shared max frequency for consistent scale
    maxfreq = 0
    freq_tables = {}
    for xcol, ycol, _, _ in comparisons:
        f = df[[xcol, ycol]].dropna().groupby([xcol, ycol]).size()
        freq_tables[(xcol, ycol)] = f
        maxfreq = max(maxfreq, f.max())

    os.makedirs(f'plots/{key}', exist_ok=True)

    for xcol, ycol, base_cmap, tag in comparisons:
        freq = freq_tables[(xcol, ycol)].reset_index(name='count')
        x, y, cnt = freq[xcol], freq[ycol], freq['count']
        res = linregress(df[xcol].dropna(), df[ycol].dropna())
        cmap_use = trim(base_cmap)

        fig, ax = plt.subplots(figsize=(6, 4), dpi=300)
        sc = ax.scatter(x, y, s=30, c=cnt, cmap=cmap_use,
                        vmin=1, vmax=maxfreq)
        ax.plot(df[xcol], res.slope*df[xcol] + res.intercept,
                color=cmap_use(0.9), linewidth=1)

        ax.set_xlabel(textwrap.fill(labels[xcol], 20), fontsize=10)
        ax.set_ylabel(textwrap.fill(labels[ycol], 20), fontsize=10)
        ax.set_title(f"{short_name[xcol]} vs {short_name[ycol]}",
                     fontsize=12, fontweight='bold', pad=12)
        ax.tick_params(labelsize=8)

        cbar = plt.colorbar(sc, ax=ax, fraction=0.046, pad=0.02)
        cbar.ax.tick_params(labelsize=8)
        cbar.set_label('Frequency', fontsize=10)

        stats_text = (f"ŷ = {res.intercept:.4f} + {res.slope:.4f} x     "
                    f"r = {res.rvalue:.4f}     R² = {res.rvalue**2:.4f}")
        ax.text(0.5, -0.38, stats_text,      # lowered further
                transform=ax.transAxes,
                ha='center', va='top', fontsize=10)

        plt.tight_layout()
        fig.savefig(f'plots/{key}/{key}_{tag}.png',
                    bbox_inches='tight', dpi=300)
        plt.close(fig)
