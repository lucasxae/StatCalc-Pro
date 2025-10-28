import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, X, Sparkles, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Calculator = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const handleFileSelect = () => {
    inputRef.current?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      toast.error("Por favor selecione um arquivo Excel (.xlsx ou .xls)");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      toast.loading("Enviando arquivo...");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error(`Upload falhou: ${res.statusText}`);
      }
      const json = await res.json();
      // salva resultado temporário para a página de resultados
      sessionStorage.setItem("results", JSON.stringify(json));
      setSelectedFile(file.name);
      toast.success("Arquivo enviado com sucesso");
    } catch (err) {
      console.error(err);
      toast.error("Falha ao enviar arquivo");
    }
  };

  const handleProcess = () => {
    const results = sessionStorage.getItem("results");
    if (!results) {
      toast.error("Nenhum resultado disponível. Faça upload primeiro.");
      return;
    }
    toast.success("Processamento concluído");
    // navega para a página de resultados (ela irá ler sessionStorage)
    navigate("/results");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <input ref={inputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={onFileChange} />
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Area Under the ROC Curve (AUC) Calculator
        </h1>
        <p className="text-muted-foreground text-lg">
          A simple tool to calculate statistical formulas from your data.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">1. Upload Your Data</CardTitle>
          <CardDescription>Please upload your data in a .xlsx format.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center">
                <FileUp className="h-8 w-8 text-accent-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium mb-1">Drag & Drop .xlsx file here</p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click the button below to select a file
                </p>
              </div>
              <Button onClick={handleFileSelect} size="lg">
                <FileUp className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedFile && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">2. File Ready for Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FileUp className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{selectedFile}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedFile(null);
                    sessionStorage.removeItem("results");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={handleProcess} size="lg">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Process Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent">
            <CardHeader>
              <CardTitle className="text-2xl">3. Calculation Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground mb-2">
                  AREA UNDER THE ROC CURVE (AUC)
                </p>
                <div className="text-7xl font-bold text-primary mb-4">—</div>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Generate Graph
                  </Button>
                  <Button variant="outline">
                    <FileUp className="mr-2 h-4 w-4" />
                    View Tables
                  </Button>
                  <Button>
                    <FileUp className="mr-2 h-4 w-4" />
                    Export Results
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Calculator;