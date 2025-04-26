import os, textwrap, pandas as pd, matplotlib.pyplot as plt, numpy as np
from scipy.stats import linregress

data_path = 'public/res+stu.csv'
out_dir   = 'plots/combined'

labels = {
    'Q4: fast food'       : 'Days Eating Fast-Food Meals Last Week',
    'Q5: soda/week'       : 'Cans of Soda Consumed Last Week',
    'Q6: hrs exercise'    : 'Hours of Exercise Last Week',
    'Q7: sleep hrs'       : 'Hours of Sleep Last Week',
    'Q12: breakfast/week' : 'Days Eating Breakfast per Week',
    'Q13: cups of water'  : 'Cups of Water Yesterday',
    'Q17: rate sleep'     : 'Rated Effect of Sleep on Health'
}


pairs = {
    'Exercise Hours vs Sleep Hours'           : ('Q7: sleep hrs', 'Q6: hrs exercise'),
    'Breakfast vs Exercise Hours'        : ('Q6: hrs exercise', 'Q12: breakfast/week'),
    'Sleep Hours vs Sleep-Importance Rating'  : ('Q17: rate sleep', 'Q7: sleep hrs'),
    'Exercise Hours vs Water'            : ('Q13: cups of water','Q6: hrs exercise'),
    'Sodas vs Fast-Food Meals'            : ('Q4: fast food',    'Q5: soda/week')
}

dot_color, line_color, outlier_col = '#d8c5f2', '#7953A9', '#bbbbbb'

os.makedirs(out_dir, exist_ok=True)
df0 = pd.read_csv(data_path).apply(pd.to_numeric, errors='coerce')

for title, (xcol, ycol) in pairs.items():
    df = df0[[xcol, ycol]].dropna()
    x, y = df[xcol], df[ycol]

    qx1, qx3 = np.percentile(x, [25, 75])
    qy1, qy3 = np.percentile(y, [25, 75])
    iqr_x, iqr_y = qx3 - qx1, qy3 - qy1
    infl_mask = (x < qx1 - 1.5*iqr_x) | (x > qx3 + 1.5*iqr_x)
    outl_mask = (y < qy1 - 1.5*iqr_y) | (y > qy3 + 1.5*iqr_y)
    keep_mask = ~(infl_mask | outl_mask)

    res = linregress(x[keep_mask], y[keep_mask])

    print(f'\n{title.upper()}')
    print('Influential (x-axis):', [(float(x[i]), float(y[i])) for i in infl_mask[infl_mask].index])
    print('Outliers (y-axis):',    [(float(x[i]), float(y[i])) for i in outl_mask[outl_mask].index])

    fig, ax = plt.subplots(figsize=(6,4), dpi=300)
    ax.scatter(x, y, s=25, color=outlier_col)
    ax.scatter(x[keep_mask], y[keep_mask], s=25, color=dot_color)
    ax.plot(x, res.slope*x + res.intercept, color=line_color, linewidth=1)

    ax.set_xlabel(textwrap.fill(labels[xcol], 28), fontsize=10)
    ax.set_ylabel(textwrap.fill(labels[ycol], 28), fontsize=10)
    ax.set_title(title, fontsize=12, fontweight='bold', pad=14)

    ax.text(0.5, -0.38,
            f"ŷ = {res.intercept:.4f} + {res.slope:.4f}·x    "
            f"r = {res.rvalue:.4f}     R² = {res.rvalue**2:.4f}",
            transform=ax.transAxes, ha='center', va='top', fontsize=8)
    ax.tick_params(labelsize=8)
    plt.tight_layout()

    filename = title.lower().replace(' ', '_').replace('-', '-') + '.png'
    fig.savefig(os.path.join(out_dir, filename),
                dpi=300, bbox_inches='tight', facecolor='white')
    plt.close(fig)

'''
EXERCISE HOURS VS SLEEP HOURS
Influential (x-axis): [(20.0, 8.0)]
Outliers (y-axis): [(35.0, 21.0), (62.0, 21.0), (21.0, 60.0), (25.0, 50.0), (49.0, 23.0), (42.0, 67.0)]

BREAKFAST VS EXERCISE HOURS
Influential (x-axis): [(21.0, 0.0), (21.0, 7.0), (60.0, 1.0), (50.0, 0.0), (23.0, 4.0), (67.0, 7.0)]
Outliers (y-axis): []

SLEEP HOURS VS SLEEP-IMPORTANCE RATING
Influential (x-axis): [(1.0, 70.0)]
Outliers (y-axis): [(7.0, 21.0), (5.0, 21.0), (10.0, 20.0)]

EXERCISE HOURS VS WATER
Influential (x-axis): [(24.0, 4.0), (20.0, 2.0), (24.0, 10.0), (24.0, 8.0), (20.0, 7.0)]
Outliers (y-axis): [(2.0, 21.0), (5.0, 21.0), (2.0, 60.0), (8.0, 50.0), (1.0, 23.0), (8.0, 67.0)]

SODAS VS FAST-FOOD MEALS
Influential (x-axis): [(7.0, 30.0), (7.0, 6.0), (7.0, 12.0), (7.0, 5.0), (7.0, 5.0)]
Outliers (y-axis): [(7.0, 30.0), (7.0, 12.0), (5.0, 20.0), (5.0, 9.0)]
'''