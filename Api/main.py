# ...existing code...
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import auc
from google.colab import files
import json
import os

def validate_columns(df: pd.DataFrame, required_cols=None):
    if required_cols is None:
        required_cols = ['tp', 'fp', 'tn', 'fn']
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        raise ValueError(f"O arquivo precisa conter as colunas: {missing}")

def compute_metrics(df: pd.DataFrame) -> pd.DataFrame:
    """
    Calcula sensibilidade, especificidade, tpr e fpr por estudo.
    Retorna DataFrame com colunas adicionais: sensitivity, specificity, tpr, fpr
    """
    df = df.copy()
    df['sensitivity'] = df['tp'] / (df['tp'] + df['fn'])
    df['specificity'] = df['tn'] / (df['tn'] + df['fp'])
    df['tpr'] = df['sensitivity']
    df['fpr'] = 1 - df['specificity']
    return df

def compute_auc(df: pd.DataFrame) -> float:
    """
    Calcula AUC a partir de colunas 'fpr' e 'tpr'. Ordena por fpr antes.
    """
    roc_df = df[['fpr', 'tpr']].sort_values('fpr')
    return float(auc(roc_df['fpr'], roc_df['tpr']))

def export_results_json(df: pd.DataFrame, out_path: str = "results.json"):
    """
    Gera um JSON com estudos e resumo (avg sensitivity, avg specificity, auc).
    """
    studies = df[['id', 'tp', 'fp', 'tn', 'fn', 'sensitivity', 'specificity']].to_dict(orient='records')
    summary = {
        'avg_sensitivity': float(df['sensitivity'].mean()),
        'avg_specificity': float(df['specificity'].mean()),
        'auc': compute_auc(df)
    }
    payload = {'studies': studies, 'summary': summary}
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    return out_path

# Upload do arquivo Excel (Colab)
print("Envie seu arquivo .xlsx com as colunas 'id', 'tp', 'fp', 'tn' e 'fn':")
uploaded = files.upload()

# Lê o primeiro arquivo enviado
file_name = list(uploaded.keys())[0]
df = pd.read_excel(file_name)

# Valida e calcula métricas
validate_columns(df, required_cols=['id','tp','fp','tn','fn'])
df_metrics = compute_metrics(df)
out_json = export_results_json(df_metrics, out_path="results.json")

# Exibe resultado
auc_value = compute_auc(df_metrics)
print(f"\n✅ AUC = {auc_value:.3f}")
print(f"Resultados salvos em: {os.path.abspath(out_json)}")
# ...existing code...