export function passwordStrength(password) {
    const patterns = {
        upper: /[A-Z]/,
        lower: /[a-z]/,
        digit: /[0-9]/,
        special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/,
    };
    let score = 0;
    if (password.length >= 8)
        score++;
    if (password.length >= 12)
        score++;
    if (patterns.upper.test(password) && patterns.lower.test(password))
        score++;
    if (patterns.digit.test(password) && patterns.special.test(password))
        score++;
    const labels = ["Too short", "Weak", "OK", "Strong", "Very strong"];
    return { score: score, label: labels[score] };
}
