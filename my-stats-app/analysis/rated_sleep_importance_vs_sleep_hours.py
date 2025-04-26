import os, textwrap, pandas as pd, matplotlib.pyplot as plt, numpy as np
from scipy.stats import linregress

df = pd.read_csv('public/res+stu.csv').apply(pd.to_numeric, errors='coerce') \
       .dropna(subset=['Q17: rate sleep', 'Q7: sleep hrs'])
x, y = df['Q17: rate sleep'], df['Q7: sleep hrs']
res = linregress(x, y)

fig, ax = plt.subplots(figsize=(6, 4), dpi=300)
ax.scatter(x, y, s=25)
ax.plot(x, res.slope * x + res.intercept, color='black', linewidth=1)
ax.set_xlabel(textwrap.fill('Rated Effect of Sleep on Health', 20), fontsize=10)
ax.set_ylabel('Sleep Hours per Week', fontsize=10)
ax.set_title('Sleep Importance vs Sleep Hours', fontsize=12, fontweight='bold', pad=12)
ax.text(0.5, -0.38,
        f"y = {res.slope:.4f} x + {res.intercept:.4f}     "
        f"r = {res.rvalue:.4f}     R² = {res.rvalue**2:.4f}",
        transform=ax.transAxes, ha='center', va='top', fontsize=8)
ax.tick_params(labelsize=8)
plt.tight_layout()

out_dir = 'plots/combined'
os.makedirs(out_dir, exist_ok=True)
fig.savefig(os.path.join(out_dir, 'sleep_importance_vs_sleep_hours.png'),
            dpi=300, bbox_inches='tight', facecolor='white')
plt.close(fig)
