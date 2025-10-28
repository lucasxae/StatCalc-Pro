# ...existing code...
import pandas as pd
import matplotlib.pyplot as plt
from google.colab import files
import os

def plot_roc_points(df: pd.DataFrame, out_png: str = "roc_points.png"):
    """
    Gera scatter da sensibilidade vs 1 - especificidade e salva imagem.
    """
    if 'sensitivity' not in df.columns or 'specificity' not in df.columns:
        df = df.copy()
        df['sensitivity'] = df['tp'] / (df['tp'] + df['fn'])
        df['specificity'] = df['tn'] / (df['tn'] + df['fp'])
    df['one_minus_spec'] = 1 - df['specificity']

    plt.figure(figsize=(6,6))
    plt.scatter(df['one_minus_spec'], df['sensitivity'], color='blue')
    for i, row in df.iterrows():
        plt.text(row['one_minus_spec'] + 0.01, row['sensitivity'], str(row.get('id', i)), fontsize=8)
    plt.plot([0, 1], [0, 1], '--', color='gray')
    plt.xlabel("1 - Especificidade (Falso Positivo)")
    plt.ylabel("Sensibilidade (Verdadeiro Positivo)")
    plt.title("Pontos ROC por estudo")
    plt.grid(True, linestyle='--', alpha=0.6)
    plt.tight_layout()
    plt.savefig(out_png, dpi=150)
    plt.show()
    return os.path.abspath(out_png)

# Upload (Colab) - mantém compatibilidade interativa
print("Envie o arquivo Excel (.xlsx) com as colunas 'id', 'tp', 'fp', 'tn', 'fn'")
uploaded = files.upload()
file_name = list(uploaded.keys())[0]
df = pd.read_excel(file_name)

# Calcula métricas e plota
df['sensibilidade'] = df['tp'] / (df['tp'] + df['fn'])
df['especificidade'] = df['tn'] / (df['fp'] + df['tn'])
df['1 - especificidade'] = 1 - df['especificidade']

# Mostra tabela resumida
display(df[['id', 'sensibilidade', 'especificidade']])

# Plota e salva arquivo
plot_path = plot_roc_points(df, out_png="roc_points.png")
print(f"Gráfico salvo em: {plot_path}")
# ...existing code...