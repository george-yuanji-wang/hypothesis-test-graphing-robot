import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import t, norm
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

##############################################################################
#     1) CREATE THE FIGURE WITH THE LEFT INFO BOX
##############################################################################
def create_figure_with_info_box(info_text: str):
    """
    Creates a figure with 1 row & 2 columns:
      - left subplot = info box
      - right subplot = distribution
    Adds consistent margins. Places info_text in a bounding box on the left.
    Returns fig, ax_info, ax_graph
    """
    fig, (ax_info, ax_graph) = plt.subplots(
        1, 2,
        gridspec_kw={'width_ratios': [1, 4]},
        figsize=(12, 8)
    )
    # Add top/bottom padding so the graph isn't sticking to edges
    fig.subplots_adjust(left=0.05, right=0.98, top=0.92, bottom=0.08, wspace=0.1)

    ax_info.axis("off")
    # Place the info text in the center with a bounding box
    ax_info.text(
        0.5, 0.5, info_text,
        ha="center", va="center", transform=ax_info.transAxes,
        fontsize=16, color=DARK_GRAY
        #bbox=dict(boxstyle="round,pad=1", ec=DARK_GRAY, lw=1.5, fc="none")
    )
    return fig, ax_info, ax_graph

##############################################################################
#     2) PLOT THE DISTRIBUTION (T OR Z) WITH THE SAME STYLE
##############################################################################
def plot_test_distribution(
    ax_graph,
    distribution: str,    # "t" or "z"
    alpha: float,
    tail_type: int,       # 1=left, 2=right, 3=two-tailed
    test_stat: float,
    p_value: float,
    test_name: str,       # e.g. "One-Sample T-Test"
    stat_label: str,      # e.g. "t" or "z"
    df: float = None,     # only used if distribution="t"
):
    """
    Plots either a t-dist or z-dist with consistent style:
      - domain clamp
      - critical region shading
      - vertical lines for critical values and test_stat
      - a marker at the x-axis intersection for each vertical line
      - p-value in legend
      - "H₀" annotation
      - The title is set to `test_name`

    tail_type interpretation (new style):
      1 => left-tailed (H₁: < ...)
      2 => right-tailed (H₁: > ...)
      3 => two-tailed (H₁: ≠ ...)
    """
    import numpy as np
    from scipy.stats import t, norm

    DARK_GRAY = '#504B38'
    COLOR_CURVE = '#ADB2D4'
    COLOR_SHADE = '#C7D9DD'
    MARKER_SIZE = 8
    BIG_MARKER_SIZE = 8
    MULTIPLIER = 1.15

    def format_val(v):
        return f"{v:.3f}"

    def format_alpha(a):
        return f"{a:.3g}"

    def format_scientific_latex(p):
        """Turns 0.000123 into something like 1.23e-4 in LaTeX form."""
        return f"{p:.3g}"

    def vertical_line_with_marker(x_val, top_y, label_str, line_style, marker_style='.', marker_sz=MARKER_SIZE):
        """Draw a vertical line from (x_val, 0) to (x_val, top_y),
           with a marker at the bottom only."""
        ax_graph.plot(
            [x_val, x_val], [0, top_y],
            color=DARK_GRAY, linestyle=line_style, lw=2,
            marker=marker_style, markersize=marker_sz,
            markevery=[0],  # marker only at the bottom
            label=label_str
        )

    # ------------------------------
    # Z-DISTRIBUTION
    # ------------------------------
    if distribution == "z":
        x_min, x_max = -4, 4
        x_vals = np.linspace(x_min, x_max, 1000)
        y_vals = norm.pdf(x_vals)
        ax_graph.plot(x_vals, y_vals, label="$z$-distribution", color=COLOR_CURVE, lw=2)

        if tail_type == 1:
            # LEFT-TAILED
            # Critical value for left tail => z_crit at alpha quantile
            z_crit = norm.ppf(alpha)  # boundary on the left
            shade_vals = np.linspace(x_min, z_crit, 500)

            ax_graph.fill_between(
                shade_vals, norm.pdf(shade_vals),
                color=COLOR_SHADE, alpha=0.7,
                label=f"Critical region ($\\alpha={format_alpha(alpha)}$)"
            )
            top_y = norm.pdf(z_crit) * MULTIPLIER
            vertical_line_with_marker(
                z_crit, top_y,
                label_str=f"$z_c={format_val(z_crit)}$",
                line_style='--'
            )

        elif tail_type == 2:
            # RIGHT-TAILED
            # Critical value for right tail => z_crit at 1 - alpha
            z_crit = norm.ppf(1 - alpha)  # boundary on the right
            shade_vals = np.linspace(z_crit, x_max, 500)

            ax_graph.fill_between(
                shade_vals, norm.pdf(shade_vals),
                color=COLOR_SHADE, alpha=0.7,
                label=f"Critical region ($\\alpha={format_alpha(alpha)}$)"
            )
            top_y = norm.pdf(z_crit) * MULTIPLIER
            vertical_line_with_marker(
                z_crit, top_y,
                label_str=f"$z_c={format_val(z_crit)}$",
                line_style='--'
            )

        else:
            # TWO-TAILED (tail_type == 3)
            z_crit_low = norm.ppf(alpha / 2)
            z_crit_high = norm.ppf(1 - alpha / 2)
            shade_low = np.linspace(x_min, z_crit_low, 500)
            shade_high = np.linspace(z_crit_high, x_max, 500)

            ax_graph.fill_between(shade_low, norm.pdf(shade_low), color=COLOR_SHADE, alpha=0.7,
                                  label=f"Critical region ($\\alpha={format_alpha(alpha)}$)")
            ax_graph.fill_between(shade_high, norm.pdf(shade_high), color=COLOR_SHADE, alpha=0.7)

            top_y_low = norm.pdf(z_crit_low) * MULTIPLIER
            top_y_high = norm.pdf(z_crit_high) * MULTIPLIER

            vertical_line_with_marker(
                z_crit_low, top_y_low,
                label_str=f"$z_c(low)={format_val(z_crit_low)}$",
                line_style='--'
            )
            vertical_line_with_marker(
                z_crit_high, top_y_high,
                label_str=f"$z_c(high)={format_val(z_crit_high)}$",
                line_style='--'
            )

        # Plot the test statistic
        boundary = max(x_min, min(x_max, test_stat))  # clamp
        if boundary != test_stat:
            # Means test_stat is out of [-4, 4]
            marker_style = '.'
            ms = BIG_MARKER_SIZE
        else:
            marker_style = '.'
            ms = MARKER_SIZE

        top_stat = norm.pdf(boundary) * MULTIPLIER
        vertical_line_with_marker(
            boundary, top_stat,
            label_str=f"${stat_label}={format_val(test_stat)}$",
            line_style='-', marker_style=marker_style, marker_sz=ms
        )

        # p-value
        ax_graph.plot([], [], ' ', label=f"$p = {format_scientific_latex(p_value)}$")

        # H₀ annotation, axis, etc.
        ax_graph.text(0, norm.pdf(0)*0.5, r"$H_0$", fontsize=14, ha='center', va='center', color=DARK_GRAY)
        ax_graph.set_xlabel(f"${stat_label}$", color=DARK_GRAY)
        ax_graph.set_ylabel("$P$", color=DARK_GRAY)
        ax_graph.set_title(test_name, color=DARK_GRAY)
        ax_graph.set_xlim(x_min, x_max)
        ax_graph.set_ylim(0, norm.pdf(0)*1.35)
        ax_graph.legend()

    # ------------------------------
    # T-DISTRIBUTION
    # ------------------------------
    elif distribution == "t":
        if df is None:
            raise ValueError("Must provide df for t-distribution.")

        x_min = t.ppf(0.001, df)
        x_max = t.ppf(0.999, df)
        x_vals = np.linspace(x_min, x_max, 1000)
        y_vals = t.pdf(x_vals, df)
        ax_graph.plot(x_vals, y_vals, label="$t$-distribution", color=COLOR_CURVE, lw=2)

        if tail_type == 1:
            # LEFT-TAILED
            t_crit = t.ppf(alpha, df)
            shade_vals = np.linspace(x_min, t_crit, 500)

            ax_graph.fill_between(
                shade_vals, t.pdf(shade_vals, df),
                color=COLOR_SHADE, alpha=0.7,
                label=f"Critical region ($\\alpha={format_alpha(alpha)}$)"
            )
            top_y = t.pdf(t_crit, df) * MULTIPLIER
            vertical_line_with_marker(
                t_crit, top_y,
                label_str=f"$t_c={format_val(t_crit)}$",
                line_style='--'
            )

        elif tail_type == 2:
            # RIGHT-TAILED
            t_crit = t.ppf(1 - alpha, df)
            shade_vals = np.linspace(t_crit, x_max, 500)

            ax_graph.fill_between(
                shade_vals, t.pdf(shade_vals, df),
                color=COLOR_SHADE, alpha=0.7,
                label=f"Critical region ($\\alpha={format_alpha(alpha)}$)"
            )
            top_y = t.pdf(t_crit, df) * MULTIPLIER
            vertical_line_with_marker(
                t_crit, top_y,
                label_str=f"$t_c={format_val(t_crit)}$",
                line_style='--'
            )

        else:
            # TWO-TAILED (tail_type == 3)
            t_crit_low = t.ppf(alpha / 2, df)
            t_crit_high = t.ppf(1 - alpha / 2, df)
            shade_low = np.linspace(x_min, t_crit_low, 500)
            shade_high = np.linspace(t_crit_high, x_max, 500)

            ax_graph.fill_between(shade_low, t.pdf(shade_low, df), color=COLOR_SHADE, alpha=0.7,
                                  label=f"Critical region ($\\alpha={format_alpha(alpha)}$)")
            ax_graph.fill_between(shade_high, t.pdf(shade_high, df), color=COLOR_SHADE, alpha=0.7)

            top_y_low = t.pdf(t_crit_low, df) * MULTIPLIER
            top_y_high = t.pdf(t_crit_high, df) * MULTIPLIER

            vertical_line_with_marker(
                t_crit_low, top_y_low,
                label_str=f"$t_c(low)={format_val(t_crit_low)}$",
                line_style='--'
            )
            vertical_line_with_marker(
                t_crit_high, top_y_high,
                label_str=f"$t_c(high)={format_val(t_crit_high)}$",
                line_style='--'
            )

        # Plot test statistic
        boundary = max(x_min, min(x_max, test_stat))
        if boundary != test_stat:
            marker_style = '.'
            ms = BIG_MARKER_SIZE
        else:
            marker_style = '.'
            ms = MARKER_SIZE

        top_stat = t.pdf(boundary, df) * MULTIPLIER
        vertical_line_with_marker(
            boundary, top_stat,
            label_str=f"${stat_label}={format_val(test_stat)}$",
            line_style='-', marker_style=marker_style, marker_sz=ms
        )

        # p-value
        ax_graph.plot([], [], ' ', label=f"$p = {format_scientific_latex(p_value)}$")
        ax_graph.text(0, t.pdf(0, df)*0.5, r"$H_0$", fontsize=14, ha='center', va='center', color=DARK_GRAY)

        ax_graph.set_xlabel(f"${stat_label}$", color=DARK_GRAY)
        ax_graph.set_ylabel("$P$", color=DARK_GRAY)
        ax_graph.set_title(test_name, color=DARK_GRAY)
        ax_graph.set_xlim(x_min, x_max)
        ax_graph.set_ylim(0, t.pdf(0, df)*1.35)
        ax_graph.legend()

    else:
        raise ValueError("distribution must be 'z' or 't'.")




##############################################################################
# 1) One-Sample T-Test
##############################################################################
def one_sample_t_test(n, s, x_bar, mu, alpha, tail_type=1):
    """
    One-sample t-test.
    Returns (fig, ax_info, ax_graph), does NOT show or save by default.
    """
    from scipy.stats import t
    df = n - 1
    t_stat = (x_bar - mu) / (s / (n**0.5))

    # Decide critical value(s) and p-value
    if tail_type == 1:
        # LEFT-TAILED
        t_crit = t.ppf(alpha, df)
        crit_str = f"$t_c = {format_val(t_crit)}$"
        p_value = t.cdf(t_stat, df)

    elif tail_type == 2:
        # RIGHT-TAILED
        t_crit = t.ppf(1 - alpha, df)
        crit_str = f"$t_c = {format_val(t_crit)}$"
        p_value = 1 - t.cdf(t_stat, df)

    else:
        # TWO-TAILED (tail_type == 3)
        t_crit_val = t.ppf(1 - alpha / 2, df)
        crit_str = f"$t_c = \\pm\\,{format_val(t_crit_val)}$"
        p_value = 2 * (1 - t.cdf(abs(t_stat), df))

    # Info box text
    info_text = (
        f"$n = {n}$\n\n"
        f"$df = {df}$\n\n"
        f"$\\bar{{x}} = {format_val(x_bar)}$\n\n"
        f"$s = {format_val(s)}$\n\n"
        f"{crit_str}\n\n"
        f"$t = {format_val(t_stat)}$\n\n"
        f"$\\alpha = {format_alpha(alpha)}$\n\n\n"
        f"$t = \\frac{{\\bar{{x}} - \\mu}}{{s / \\sqrt{{n}}}} = {format_val(t_stat)}$"
    )

    fig, ax_info, ax_graph = create_figure_with_info_box(info_text)
    plot_test_distribution(
        ax_graph=ax_graph,
        distribution="t",
        alpha=alpha,
        tail_type=tail_type,
        test_stat=t_stat,
        p_value=p_value,
        test_name="One-Sample T-Test",
        stat_label="t",
        df=df
    )
    return fig, ax_info, ax_graph


##############################################################################
# 2) One-Sample Z-Test
##############################################################################
def one_sample_z_test(n, sigma, x_bar, mu, alpha, tail_type=1):
    """
    One-sample Z-test, known sigma.
    Returns figure, does NOT show/save automatically.
    """
    from scipy.stats import norm
    z_stat = (x_bar - mu) / (sigma / (n**0.5))

    if tail_type == 1:
        # LEFT-TAILED
        z_crit = norm.ppf(alpha)
        crit_str = f"$z_c = {format_val(z_crit)}$"
        p_value = norm.cdf(z_stat)

    elif tail_type == 2:
        # RIGHT-TAILED
        z_crit = norm.ppf(1 - alpha)
        crit_str = f"$z_c = {format_val(z_crit)}$"
        p_value = 1 - norm.cdf(z_stat)

    else:
        # TWO-TAILED (tail_type == 3)
        z_crit_val = norm.ppf(1 - alpha / 2)
        crit_str = f"$z_c = \\pm\\,{format_val(z_crit_val)}$"
        p_value = 2 * (1 - norm.cdf(abs(z_stat)))

    info_text = (
        f"$n = {n}$\n\n"
        f"$\\sigma = {format_val(sigma)}$\n\n"
        f"$\\bar{{x}} = {format_val(x_bar)}$\n\n"
        f"{crit_str}\n\n"
        f"$z = {format_val(z_stat)}$\n\n"
        f"$\\alpha = {format_alpha(alpha)}$\n\n\n"
        f"$z = \\frac{{\\bar{{x}} - \\mu}}{{\\sigma / \\sqrt{{n}}}} = {format_val(z_stat)}$"
    )

    fig, ax_info, ax_graph = create_figure_with_info_box(info_text)
    plot_test_distribution(
        ax_graph=ax_graph,
        distribution="z",
        alpha=alpha,
        tail_type=tail_type,
        test_stat=z_stat,
        p_value=p_value,
        test_name="One-Sample Z-Test",
        stat_label="z"
    )
    return fig, ax_info, ax_graph


##############################################################################
# 3) One-Sample Proportion Z-Test
##############################################################################
def one_sample_proportion_z_test(n, p_hat, p, alpha, tail_type=1):
    """
    One-sample proportion z-test.
    Returns figure, does NOT show/save automatically.
    """
    from scipy.stats import norm

    q = 1 - p
    z_stat = (p_hat - p) / ((p*q / n)**0.5)

    if tail_type == 1:
        # LEFT-TAILED
        z_crit = norm.ppf(alpha)
        crit_str = f"$z_c = {format_val(z_crit)}$"
        p_value = norm.cdf(z_stat)

    elif tail_type == 2:
        # RIGHT-TAILED
        z_crit = norm.ppf(1 - alpha)
        crit_str = f"$z_c = {format_val(z_crit)}$"
        p_value = 1 - norm.cdf(z_stat)

    else:
        # TWO-TAILED (tail_type == 3)
        z_crit_val = norm.ppf(1 - alpha / 2)
        crit_str = f"$z_c = \\pm\\,{format_val(z_crit_val)}$"
        p_value = 2 * (1 - norm.cdf(abs(z_stat)))

    info_text = (
        f"$n = {n}$\n\n"
        f"$\\hat{{p}} = {format_val(p_hat)}$\n\n"
        f"$p = {format_val(p)},\\ q=1-p$\n\n"
        f"{crit_str}\n\n"
        f"$z = {format_val(z_stat)}$\n\n"
        f"$\\alpha = {format_alpha(alpha)}$\n\n\n"
        f"$z = \\frac{{\\hat{{p}} - p}}{{\\sqrt{{p\\,q / n}}}} = {format_val(z_stat)}$"
    )

    fig, ax_info, ax_graph = create_figure_with_info_box(info_text)
    plot_test_distribution(
        ax_graph=ax_graph,
        distribution="z",
        alpha=alpha,
        tail_type=tail_type,
        test_stat=z_stat,
        p_value=p_value,
        test_name="One-Sample Proportion Z-Test",
        stat_label="z"
    )
    return fig, ax_info, ax_graph


##############################################################################
# 4) Two-Dependent-Sample Z-Test (sigma_d known)
##############################################################################
def two_dependent_z_test(n, sigma_d, d_bar, alpha, tail_type=1):
    """
    Two-dependent-sample Z-test, difference = X1 - X2, sigma_d known.
    Returns figure, does NOT show/save automatically.
    """
    from scipy.stats import norm

    z_stat = d_bar / (sigma_d / (n**0.5))

    if tail_type == 1:
        # LEFT-TAILED
        z_crit = norm.ppf(alpha)
        crit_str = f"$z_c = {format_val(z_crit)}$"
        p_value = norm.cdf(z_stat)

    elif tail_type == 2:
        # RIGHT-TAILED
        z_crit = norm.ppf(1 - alpha)
        crit_str = f"$z_c = {format_val(z_crit)}$"
        p_value = 1 - norm.cdf(z_stat)

    else:
        # TWO-TAILED (tail_type == 3)
        z_crit_val = norm.ppf(1 - alpha / 2)
        crit_str = f"$z_c = \\pm\\,{format_val(z_crit_val)}$"
        p_value = 2 * (1 - norm.cdf(abs(z_stat)))

    info_text = (
        f"$n = {n}$\n\n"
        f"$\\sigma_d = {format_val(sigma_d)}$\n\n"
        f"$\\bar{{d}} = {format_val(d_bar)}$\n\n"
        f"{crit_str}\n\n"
        f"$z = {format_val(z_stat)}$\n\n"
        f"$\\alpha = {format_alpha(alpha)}$\n\n\n"
        f"$z = \\frac{{\\bar{{d}} - 0}}{{\\sigma_d / \\sqrt{{n}}}} = {format_val(z_stat)}$"
    )

    fig, ax_info, ax_graph = create_figure_with_info_box(info_text)
    plot_test_distribution(
        ax_graph=ax_graph,
        distribution="z",
        alpha=alpha,
        tail_type=tail_type,
        test_stat=z_stat,
        p_value=p_value,
        test_name="Two-Dependent-Sample Z-Test",
        stat_label="z"
    )
    return fig, ax_info, ax_graph


##############################################################################
# 5) Two-Dependent-Sample T-Test (Paired T)
##############################################################################
def two_dependent_t_test(n, s_d, d_bar, alpha, tail_type=1):
    """
    Two-dependent-sample T-test (paired).
    Returns figure, does NOT show/save automatically.
    """
    from scipy.stats import t

    df = n - 1
    t_stat = d_bar / (s_d / (n**0.5))

    # Decide critical value(s) and p-value
    if tail_type == 1:
        # LEFT-TAILED
        t_crit = t.ppf(alpha, df)
        crit_str = f"$t_c = {format_val(t_crit)}$"
        p_value = t.cdf(t_stat, df)

    elif tail_type == 2:
        # RIGHT-TAILED
        t_crit = t.ppf(1 - alpha, df)
        crit_str = f"$t_c = {format_val(t_crit)}$"
        p_value = 1 - t.cdf(t_stat, df)

    else:
        # TWO-TAILED (tail_type == 3)
        t_crit_val = t.ppf(1 - alpha / 2, df)
        crit_str = f"$t_c = \\pm\\,{format_val(t_crit_val)}$"
        p_value = 2 * (1 - t.cdf(abs(t_stat), df))

    info_text = (
        f"$n = {n}$\n\n"
        f"$s_d = {format_val(s_d)}$\n\n"
        f"$\\bar{{d}} = {format_val(d_bar)}$\n\n"
        f"{crit_str}\n\n"
        f"$t = {format_val(t_stat)}$\n\n"
        f"$\\alpha = {format_alpha(alpha)}$\n\n\n"
        f"$t = \\frac{{\\bar{{d}} - 0}}{{s_d/\\sqrt{{n}}}} = {format_val(t_stat)}$"
    )

    fig, ax_info, ax_graph = create_figure_with_info_box(info_text)
    plot_test_distribution(
        ax_graph=ax_graph,
        distribution="t",
        alpha=alpha,
        tail_type=tail_type,
        test_stat=t_stat,
        p_value=p_value,
        test_name="Two-Dependent-Sample T-Test",
        stat_label="t",
        df=df
    )
    return fig, ax_info, ax_graph


##############################################################################
# 6) Two-Dependent-Sample Proportion Test (McNemar)
##############################################################################
def two_dependent_proportion_test(n10, n01, n11, n00, alpha, tail_type=2):
    """
    Two-dependent-sample proportion test, e.g. McNemar’s approximation.
    Supports 3 tail types:
      1 => Left-tailed (H₁: Δp < 0)
      2 => Right-tailed (H₁: Δp > 0)
      3 => Two-tailed (H₁: Δp ≠ 0)

    Returns figure, does NOT show/save automatically.
    """
    from scipy.stats import norm

    # rename b, c for clarity in the formula
    b = n10
    c = n01
    
    # continuity-corrected numerator
    numerator = abs(b - c) - 1
    if numerator < 0:
        numerator = 0

    # compute z_stat for McNemar’s approximation
    z_stat = numerator / ((b + c + 1e-15)**0.5)

    # Decide critical value(s), p-value, and text for info box, based on tail_type
    if tail_type == 1:
        # LEFT-TAILED (H₁: Δp < 0)
        z_crit = norm.ppf(alpha)
        crit_str = f"$z_c = {format_val(z_crit)}$"
        p_value = norm.cdf(z_stat)

    elif tail_type == 2:
        # RIGHT-TAILED (H₁: Δp > 0)
        z_crit = norm.ppf(1 - alpha)
        crit_str = f"$z_c = {format_val(z_crit)}$"
        p_value = 1 - norm.cdf(z_stat)

    else:
        # TWO-TAILED (H₁: Δp ≠ 0)
        z_crit_val = norm.ppf(1 - alpha/2)
        crit_str = f"$z_c = \\pm\\,{format_val(z_crit_val)}$"
        p_value = 2 * (1 - norm.cdf(abs(z_stat)))

    # Build info box text
    info_text = (
        f"$n_{{10}} = {n10}$\n\n"
        f"$n_{{01}} = {n01}$\n\n"
        f"$n_{{11}} = {n11}$\n\n"
        f"$n_{{00}} = {n00}$\n\n"
        f"{crit_str}\n\n"
        f"$z = {format_val(z_stat)}$\n\n"
        f"$\\alpha = {format_alpha(alpha)}$\n\n\n"
        "McNemar’s approx:\n"
        "$z = \\frac{|b-c|-1}{\\sqrt{b + c}}$"
    )

    # Create figure and plot
    fig, ax_info, ax_graph = create_figure_with_info_box(info_text)
    plot_test_distribution(
        ax_graph=ax_graph,
        distribution="z",
        alpha=alpha,
        tail_type=tail_type,
        test_stat=z_stat,
        p_value=p_value,
        test_name="Two-Dependent-Sample Proportion Test (McNemar)",
        stat_label="z"
    )
    return fig, ax_info, ax_graph



##############################################################################
# 7) Two-Independent-Sample Z-Test (sigma1, sigma2 known)
##############################################################################
def two_independent_z_test(n1, n2, sigma1, sigma2, x_bar1, x_bar2, alpha, tail_type=1):
    """
    Two-independent-sample Z-test, difference in means=0, known sigma1, sigma2.
    Returns figure, does NOT show/save automatically.
    """
    from scipy.stats import norm

    diff = x_bar1 - x_bar2
    se = ((sigma1**2)/n1 + (sigma2**2)/n2)**0.5
    z_stat = diff / se

    if tail_type == 1:
        # LEFT-TAILED
        z_crit = norm.ppf(alpha)
        crit_str = f"$z_c = {format_val(z_crit)}$"
        p_value = norm.cdf(z_stat)

    elif tail_type == 2:
        # RIGHT-TAILED
        z_crit = norm.ppf(1 - alpha)
        crit_str = f"$z_c = {format_val(z_crit)}$"
        p_value = 1 - norm.cdf(z_stat)

    else:
        # TWO-TAILED (tail_type == 3)
        z_crit_val = norm.ppf(1 - alpha / 2)
        crit_str = f"$z_c = \\pm\\,{format_val(z_crit_val)}$"
        p_value = 2 * (1 - norm.cdf(abs(z_stat)))

    info_text = (
        f"$n_1 = {n1}$\n\n"
        f"$n_2 = {n2}$\n\n"
        f"$\\sigma_1 = {format_val(sigma1)}$\n\n"
        f"$\\sigma_2 = {format_val(sigma2)}$\n\n"
        f"$\\bar{{x}}_1 = {format_val(x_bar1)}$\n\n"
        f"$\\bar{{x}}_2 = {format_val(x_bar2)}$\n\n"
        f"{crit_str}\n\n"
        f"$z = {format_val(z_stat)}$\n\n"
        f"$\\alpha = {format_alpha(alpha)}$\n\n\n"
        f"$z = \\frac{{(\\bar{{x}}_1 - \\bar{{x}}_2)}}{{\\sqrt{{\\frac{{\\sigma_1^2}}{{n_1}} + \\frac{{\\sigma_2^2}}{{n_2}}}}}} = {format_val(z_stat)}$"
    )

    fig, ax_info, ax_graph = create_figure_with_info_box(info_text)
    plot_test_distribution(
        ax_graph=ax_graph,
        distribution="z",
        alpha=alpha,
        tail_type=tail_type,
        test_stat=z_stat,
        p_value=p_value,
        test_name="Two-Independent-Sample Z-Test",
        stat_label="z"
    )
    return fig, ax_info, ax_graph


##############################################################################
# 8) Two-Independent-Sample T-Test (Welch)
##############################################################################
def two_independent_t_test(n1, n2, s1, s2, x_bar1, x_bar2, alpha, tail_type=1):
    """
    Welch's two-independent-sample T-test (no pooled variance).
    
    H₀: (μ₁ - μ₂) = 0
    H₁ depends on tail_type:
      1 => (μ₁ - μ₂) < 0   (left-tailed)
      2 => (μ₁ - μ₂) > 0   (right-tailed)
      3 => (μ₁ - μ₂) ≠ 0   (two-tailed)
    
    Returns figure, does NOT show/save automatically.
    """
    from scipy.stats import t

    # Compute the difference in sample means
    diff = x_bar1 - x_bar2

    # Compute each sample's variance/n
    var1 = (s1**2) / n1
    var2 = (s2**2) / n2

    # Standard error under Welch's assumptions
    se = (var1 + var2) ** 0.5

    # Test statistic
    t_stat = diff / se

    # Satterthwaite's approximation for df
    numerator = (var1 + var2) ** 2
    denominator = (var1**2) / (n1 - 1) + (var2**2) / (n2 - 1)
    df_welch = numerator / (denominator + 1e-15)

    # Decide critical values and p-value based on tail_type
    if tail_type == 1:
        # LEFT-TAILED (H₁: μ₁ - μ₂ < 0)
        t_crit = t.ppf(alpha, df_welch)
        crit_str = f"$t_c = {format_val(t_crit)}$"
        p_value = t.cdf(t_stat, df_welch)

    elif tail_type == 2:
        # RIGHT-TAILED (H₁: μ₁ - μ₂ > 0)
        t_crit = t.ppf(1 - alpha, df_welch)
        crit_str = f"$t_c = {format_val(t_crit)}$"
        p_value = 1 - t.cdf(t_stat, df_welch)

    else:
        # TWO-TAILED (H₁: μ₁ - μ₂ ≠ 0) => tail_type=3
        t_crit_val = t.ppf(1 - alpha / 2, df_welch)
        crit_str = f"$t_c = \\pm\\,{format_val(t_crit_val)}$"
        p_value = 2 * (1 - t.cdf(abs(t_stat), df_welch))

    info_text = (
        f"$n_1 = {n1}$\n\n"
        f"$n_2 = {n2}$\n\n"
        f"$s_1 = {format_val(s1)}$\n\n"
        f"$s_2 = {format_val(s2)}$\n\n"
        f"$\\bar{{x}}_1 = {format_val(x_bar1)}$\n\n"
        f"$\\bar{{x}}_2 = {format_val(x_bar2)}$\n\n"
        f"{crit_str}\n\n"
        f"$t = {format_val(t_stat)}$\n\n"
        f"df$_{{\\mathrm{{Welch}}}} = {format_val(df_welch)}$\n\n"
        f"$\\alpha = {format_alpha(alpha)}$\n\n\n"
        f"$t = \\frac{{(\\bar{{x}}_1 - \\bar{{x}}_2)}}{{\\sqrt{{\\frac{{s_1^2}}{{n_1}} + \\frac{{s_2^2}}{{n_2}}}}}} = {format_val(t_stat)}$"
    )

    fig, ax_info, ax_graph = create_figure_with_info_box(info_text)
    plot_test_distribution(
        ax_graph=ax_graph,
        distribution="t",
        alpha=alpha,
        tail_type=tail_type,
        test_stat=t_stat,
        p_value=p_value,
        test_name="Welch Two-Sample T-Test",
        stat_label="t",
        df=df_welch
    )
    return fig, ax_info, ax_graph



##############################################################################
# 9) Two-Independent-Sample Proportion Z-Test
##############################################################################
def two_independent_proportion_z_test(x1, x2, n1, n2, alpha, tail_type=1):
    """
    Two-independent-sample proportion z-test, difference in p1-p2=0
    Returns figure, does NOT show/save automatically.
    """
    from scipy.stats import norm

    p1_hat = x1/n1
    p2_hat = x2/n2
    p_hat = (x1 + x2)/(n1 + n2)
    q_hat = 1 - p_hat

    diff = p1_hat - p2_hat
    se = (p_hat*q_hat*(1/n1 + 1/n2))**0.5
    z_stat = diff / se

    if tail_type == 1:
        # LEFT-TAILED
        z_crit = norm.ppf(alpha)
        crit_str = f"$z_c = {format_val(z_crit)}$"
        p_value = norm.cdf(z_stat)

    elif tail_type == 2:
        # RIGHT-TAILED
        z_crit = norm.ppf(1 - alpha)
        crit_str = f"$z_c = {format_val(z_crit)}$"
        p_value = 1 - norm.cdf(z_stat)

    else:
        # TWO-TAILED (tail_type == 3)
        z_crit_val = norm.ppf(1 - alpha / 2)
        crit_str = f"$z_c = \\pm\\,{format_val(z_crit_val)}$"
        p_value = 2 * (1 - norm.cdf(abs(z_stat)))

    info_text = (
        f"$n_1 = {n1}$\n\n"
        f"$n_2 = {n2}$\n\n"
        f"$\\hat{{p}}_1 = {format_val(p1_hat)}$\n\n"
        f"$\\hat{{p}}_2 = {format_val(p2_hat)}$\n\n"
        f"$\\hat{{p}} = {format_val(p_hat)},\\ \\hat{{q}}=1-\\hat{{p}}$\n\n"
        f"{crit_str}\n\n"
        f"$z = {format_val(z_stat)}$\n\n"
        f"$\\alpha = {format_alpha(alpha)}$\n\n\n"
        "$z = \\frac{\\hat{p}_1 - \\hat{p}_2}{\\sqrt{\\hat{p}\\,\\hat{q}\\left(\\frac{1}{n_1} + \\frac{1}{n_2}\\right)}} = "
        + f"{format_val(z_stat)}$"
    )

    fig, ax_info, ax_graph = create_figure_with_info_box(info_text)
    plot_test_distribution(
        ax_graph=ax_graph,
        distribution="z",
        alpha=alpha,
        tail_type=tail_type,
        test_stat=z_stat,
        p_value=p_value,
        test_name="Two-Independent-Sample Proportion Z-Test",
        stat_label="z"
    )
    return fig, ax_info, ax_graph


def show_figure(fig):
    """Explicitly show the figure on screen."""
    plt.show()

def save_figure(fig, filename="my_figure.png"):
    """Save the figure to a file with tight layout."""
    fig.savefig(filename, bbox_inches='tight')


def _wrap_test_function(func):
    def wrapped(*args, **kwargs):
        fig, ax_info, ax_graph = func(*args, **kwargs)
        buf = io.BytesIO()
        fig.savefig(buf, format="png", bbox_inches="tight", dpi=300)
        plt.close(fig)
        buf.seek(0)
        return base64.b64encode(buf.read()).decode("utf-8")
    return wrapped

TESTS = {}

TESTS["one_sample_t_test"] = _wrap_test_function(one_sample_t_test)
TESTS["one_sample_z_test"] = _wrap_test_function(one_sample_z_test)
TESTS["one_sample_proportion_z_test"] = _wrap_test_function(one_sample_proportion_z_test)
TESTS["two_dependent_z_test"] = _wrap_test_function(two_dependent_z_test)
TESTS["two_dependent_t_test"] = _wrap_test_function(two_dependent_t_test)
TESTS["two_dependent_proportion_test"] = _wrap_test_function(two_dependent_proportion_test)
TESTS["two_independent_z_test"] = _wrap_test_function(two_independent_z_test)
TESTS["two_independent_t_test"] = _wrap_test_function(two_independent_t_test)
TESTS["two_independent_proportion_z_test"] = _wrap_test_function(two_independent_proportion_z_test)
