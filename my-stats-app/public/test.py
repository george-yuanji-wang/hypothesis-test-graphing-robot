import numpy as np
import matplotlib.pyplot as plt
#from scipy.stats import t, norm
import io
import base64

##############################################################################
#                          HELPER FORMATTING FUNCTIONS
##############################################################################
def format_val(val):
    """If |val|<2, show 4 decimals; else 2 decimals."""
    if abs(val) < 2:
        return f"{val:.4f}"
    else:
        return f"{val:.2f}"

def format_alpha(a):
    """If alpha>=0.01, 2 decimals; else 5 decimals."""
    if a >= 0.01:
        return f"{a:.2f}"
    else:
        return f"{a:.5f}"

def format_scientific_latex(val):
    """3-decimals scientific notation in LaTeX, no extra $."""
    if val == 0:
        return "0"
    exponent = int(np.floor(np.log10(abs(val))))
    mantissa = val / 10**exponent
    return f"{mantissa:.3f}\\times10^{{{exponent}}}"

##############################################################################
#                      CONSTANTS FOR A CONSISTENT STYLE
##############################################################################
DARK_GRAY = '#504B38'
COLOR_CURVE = '#ADB2D4'
COLOR_SHADE = '#C7D9DD'
MARKER_SIZE = 8
BIG_MARKER_SIZE = 8  # unify
MULTIPLIER = 1.15

def plot_chi_square_distribution(
    ax_graph,
    alpha: float,
    test_stat: float,
    p_value: float,
    test_name: str,
    df: int,
):
    from scipy.stats import chi2
    import numpy as np

    DARK_GRAY = '#504B38'
    COLOR_CURVE = '#ADB2D4'
    COLOR_SHADE = '#C7D9DD'
    MARKER_SIZE = 8
    MULTIPLIER = 1.15

    def vertical_line_with_marker(x_val, top_y, label_str, line_style, marker_style='.', marker_sz=MARKER_SIZE):
        ax_graph.plot(
            [x_val, x_val], [0, top_y],
            color=DARK_GRAY, linestyle=line_style, lw=2,
            marker=marker_style, markersize=marker_sz,
            markevery=[0],
            label=label_str
        )

    x_min = 0 if df > 2 else 1e-6
    x_max = chi2.ppf(0.999, df)
    x_vals = np.linspace(x_min, x_max, 1000)
    y_vals = chi2.pdf(x_vals, df)
    y_vals = np.minimum(y_vals, 1.0)
    ax_graph.plot(x_vals, y_vals, label="$\chi^2$-distribution", color=COLOR_CURVE, lw=2)

    chi_crit = chi2.ppf(1 - alpha, df)
    shade_vals = np.linspace(chi_crit, x_max, 500)
    shade_pdf = np.minimum(chi2.pdf(shade_vals, df), 1.0)
    ax_graph.fill_between(shade_vals, shade_pdf, color=COLOR_SHADE, alpha=0.7, label=f"Critical region ($\\alpha={format_alpha(alpha)}$)")

    top_y = min(chi2.pdf(chi_crit, df) * MULTIPLIER, 1.0)
    vertical_line_with_marker(chi_crit, top_y, f"$\\chi^2_c={format_val(chi_crit)}$", '--')

    boundary = max(x_min, min(x_max, test_stat))
    top_stat = min(chi2.pdf(boundary, df) * MULTIPLIER, 1.0)
    vertical_line_with_marker(boundary, top_stat, f"$\\chi^2={format_val(test_stat)}$", '-')

    ax_graph.plot([], [], ' ', label=f"$p-value = {format_scientific_latex(p_value)}$")

    if df == 1:
        h0_x_pos = 0.5
        h0_y_pos = min(chi2.pdf(h0_x_pos, df) * 0.25, 1.0)
    elif df == 2:
        h0_x_pos = 1
        h0_y_pos = min(chi2.pdf(h0_x_pos, df) * 0.4, 1.0)
    else:
        h0_x_pos = df - 2
        h0_y_pos = min(chi2.pdf(h0_x_pos, df) * 0.45, 1.0)

    ax_graph.text(h0_x_pos, h0_y_pos, r"$H_0$", fontsize=14, ha='center', va='center', color=DARK_GRAY)
    ax_graph.set_xlabel("$\\chi^2$", color=DARK_GRAY)
    ax_graph.set_ylabel("$Probability$", color=DARK_GRAY)
    ax_graph.set_title(test_name, color=DARK_GRAY)
    ax_graph.set_xlim(x_min, x_max)
    ax_graph.set_ylim(0, np.max(y_vals) * 1.35)
    ax_graph.legend()






# Example inputs for the Chi-Square test
alpha = 0.05
test_stat = 7.5
p_value = 0.023
test_name = "Chi-Square Goodness of Fit Test"
df = 10  # Degrees of freedom

# Create a figure and axis for the plot
fig, ax = plt.subplots(figsize=(8, 6))

# Call the function with the test case data
plot_chi_square_distribution(ax, alpha, test_stat, p_value, test_name, df)

# Display the plot
plt.show()