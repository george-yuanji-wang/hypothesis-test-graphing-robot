import os
import itertools
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import linregress

paths = {
    'resnstu': 'public/res+stu.csv',
    'res':     'public/residents.csv',
    'stu':     'public/students.csv',
}

drop_t = ['Q17t: Q1 other','Q27t: others','Q37t: other']
q2 = ['Q2: asthma ppl','Q2: cancer ppl','Q2: diabetes ppl','Q2: heart disease ppl','Q2: high blood pressure ppl','Q2: none','Q2: others']
q3 = ['Q3: asthma family history','Q3: cancer history','Q3: diabetes history','Q3: heart disease history','Q3: high blood pressure history','Q3: no history','Q3: other history']

def preprocess(df):
    df = df.drop(columns=drop_t)
    df['Q2_sum'] = df[q2].sum(axis=1)
    df['Q3_sum'] = df[q3].sum(axis=1)
    df = df.drop(columns=q2+q3)
    return df

def univariate_filter(df, thresh=3):
    num = df.select_dtypes(include='number')
    std = num.std(ddof=0)
    mean = num.mean()
    mask = ((num - mean).abs() <= thresh * std).all(axis=1)
    return df[mask].reset_index(drop=True)

os.makedirs('plots', exist_ok=True)

for key, path in paths.items():
    df = pd.read_csv(path)
    df = preprocess(df)
    df = univariate_filter(df)
    num = df.select_dtypes(include='number')
    num = num.loc[:, num.std(ddof=0) > 0]

    # save correlation matrix
    m = num.corr()
    fig, ax = plt.subplots(figsize=(10,8))
    im = ax.imshow(m, vmin=-1, vmax=1, cmap='RdBu')
    ax.set_xticks(range(len(m))); ax.set_yticks(range(len(m)))
    ax.set_xticklabels(m.columns, rotation=90, fontsize=6)
    ax.set_yticklabels(m.columns, fontsize=6)
    fig.savefig(f'plots/{key}_corr.png', dpi=300)
    plt.close(fig)

    # scatterplots
    os.makedirs(f'plots/{key}', exist_ok=True)
    cols = num.columns.tolist()
    for i,(xcol,ycol) in enumerate(itertools.combinations(cols,2),1):
        x = num[xcol]; y = num[ycol]
        mask = x.notna() & y.notna() & (x.std(ddof=0)>0) & (y.std(ddof=0)>0)
        x,y = x[mask], y[mask]
        if len(x) < 2: continue
        try:
            res = linregress(x,y)
        except:
            continue
        slope, intercept, r, p, se = res.slope, res.intercept, res.rvalue, res.pvalue, res.stderr
        line = slope*x + intercept
        fig,ax = plt.subplots(figsize=(6,4))
        ax.scatter(x,y,s=10)
        ax.plot(x,line,linewidth=1,color='black')
        ax.set_xlabel(xcol,fontsize=6); ax.set_ylabel(ycol,fontsize=6)
        ax.set_title(f'{xcol} vs {ycol}',fontsize=8)
        legend = f'a={slope:.2f}, b={intercept:.2f}\nr={r:.2f}, R²={r*r:.2f}'
        ax.legend([legend],fontsize=6,loc='best')
        fig.savefig(f'plots/{key}/{key}_{i}.png',dpi=300)
        plt.close(fig)
