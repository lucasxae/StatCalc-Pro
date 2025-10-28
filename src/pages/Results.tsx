import { useState } from "react";
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
import { studiesWithMetrics } from "@/data/studiesData";

const Results = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter studies based on search
  const filteredStudies = studiesWithMetrics.filter((study) =>
    study.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredStudies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudies = filteredStudies.slice(startIndex, endIndex);

  // Calculate summary statistics
  const avgSensitivity =
    studiesWithMetrics.reduce((sum, s) => sum + s.sensitivity!, 0) /
    studiesWithMetrics.length;
  const avgSpecificity =
    studiesWithMetrics.reduce((sum, s) => sum + s.specificity!, 0) /
    studiesWithMetrics.length;

  const formatNumber = (num: number, decimals: number = 6) => {
    return num.toFixed(decimals);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Análise Estatística de Estudos
          </h1>
          <p className="text-muted-foreground">
            Análise baseada em {studiesWithMetrics.length} estudos elegíveis - Dados de VP, FP, VN, FN
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
                {studiesWithMetrics.length}
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
                {formatNumber(avgSensitivity, 4)}
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
                {formatNumber(avgSpecificity, 4)}
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
              <div className="text-4xl font-bold text-primary">0.89</div>
              <p className="text-xs text-muted-foreground mt-1">AUC estimada</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-2xl">Dados dos Estudos</CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar estudo..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-bold w-12">#</TableHead>
                  <TableHead className="font-bold min-w-[200px]">Estudo</TableHead>
                  <TableHead className="font-bold text-center">VP</TableHead>
                  <TableHead className="font-bold text-center">FP</TableHead>
                  <TableHead className="font-bold text-center">VN</TableHead>
                  <TableHead className="font-bold text-center">FN</TableHead>
                  <TableHead className="font-bold text-center">Sensibilidade</TableHead>
                  <TableHead className="font-bold text-center">Especificidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentStudies.map((study, index) => (
                  <TableRow key={study.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-muted-foreground">
                      {startIndex + index}
                    </TableCell>
                    <TableCell className="font-medium">{study.id}</TableCell>
                    <TableCell className="text-center">{study.tp.toLocaleString()}</TableCell>
                    <TableCell className="text-center">{study.fp.toLocaleString()}</TableCell>
                    <TableCell className="text-center">{study.tn.toLocaleString()}</TableCell>
                    <TableCell className="text-center">{study.fn.toLocaleString()}</TableCell>
                    <TableCell className="text-center font-semibold text-primary">
                      {formatNumber(study.sensitivity!)}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-primary">
                      {formatNumber(study.specificity!)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1}-{Math.min(endIndex, filteredStudies.length)} de{" "}
              {filteredStudies.length} estudos
            </p>
            <div className="flex gap-1 flex-wrap justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
