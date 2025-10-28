// ...existing code...
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileImage, FileSpreadsheet, FileText, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { studiesWithMetrics } from "@/data/studiesData"; // REMOVED - agora usamos dados reais via API/sessionStorage

const Results = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studies, setStudies] = useState<any[]>([]);
  const [summary, setSummary] = useState<{ avg_sensitivity?: number; avg_specificity?: number; auc?: number }>({});
  const itemsPerPage = 10;

  useEffect(() => {
    const loadFromSession = () => {
      const raw = sessionStorage.getItem("results");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setStudies(parsed.studies || []);
          setSummary(parsed.summary || {});
          return true;
        } catch (e) {
          console.error("Falha ao parsear results do sessionStorage", e);
        }
      }
      return false;
    };

    const loaded = loadFromSession();
    if (!loaded) {
      // fallback: tenta buscar a API (se existir)
      fetch("/api/results")
        .then((r) => {
          if (!r.ok) throw new Error("no results");
          return r.json();
        })
        .then((json) => {
          setStudies(json.studies || []);
          setSummary(json.summary || {});
        })
        .catch(() => {
          // manter array vazio se nada encontrado
          setStudies([]);
          setSummary({});
        });
    }
  }, []);

  // Filter studies based on search
  const filteredStudies = studies.filter((study) =>
    (study.id || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredStudies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudies = filteredStudies.slice(startIndex, endIndex);

  const formatNumber = (num: number, decimals: number = 6) => {
    return Number(num).toFixed(decimals);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Análise Estatística de Estudos
          </h1>
          <p className="text-muted-foreground">
            Análise baseada em {studies.length} estudos elegíveis - Dados de VP, FP, VN, FN
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <FileImage className="mr-2 h-4 w-4" />
            Exportar Gráfico
          </Button>
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
          <Button size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Estatísticas Resumidas</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Estudos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {studies.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Artigos analisados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sensibilidade Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {summary.avg_sensitivity ? formatNumber(summary.avg_sensitivity, 4) : "—"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                VP / (VP + FN)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Especificidade Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {summary.avg_specificity ? formatNumber(summary.avg_specificity, 4) : "—"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                VN / (VN + FP)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Área Sob a Curva
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {summary.auc ? formatNumber(summary.auc, 3) : "—"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">AUC estimada</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Legend Card */}
      <Card className="bg-accent">
        <CardHeader>
          <CardTitle className="text-lg">Legenda das Métricas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div>
            <p className="font-semibold text-foreground">VP (Verdadeiro Positivo)</p>
            <p className="text-muted-foreground">Casos positivos corretamente identificados</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">FP (Falso Positivo)</p>
            <p className="text-muted-foreground">Casos negativos identificados como positivos</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">VN (Verdadeiro Negativo)</p>
            <p className="text-muted-foreground">Casos negativos corretamente identificados</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">FN (Falso Negativo)</p>
            <p className="text-muted-foreground">Casos positivos identificados como negativos</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
