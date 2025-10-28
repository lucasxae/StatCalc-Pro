import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileUp, BarChart3, FileText, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const recentAnalyses = [
    { id: 1, name: "Patient_Data_Q4.csv", date: "2024-01-15", auc: 0.89 },
    { id: 2, name: "Clinical_Trial_2024.xlsx", date: "2024-01-12", auc: 0.92 },
    { id: 3, name: "Research_Dataset_Jan.csv", date: "2024-01-10", auc: 0.87 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Welcome back! Start a new analysis or review your recent calculations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">24</div>
            <p className="text-xs text-muted-foreground mt-1">+3 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. AUC Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">0.88</div>
            <p className="text-xs text-muted-foreground mt-1">Across all datasets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Processed</CardTitle>
            <FileUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">1.2K</div>
            <p className="text-xs text-muted-foreground mt-1">Records analyzed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">18</div>
            <p className="text-xs text-muted-foreground mt-1">PDF exports</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Begin a new statistical analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/calculator">
              <Button className="w-full justify-start gap-2" size="lg">
                <FileUp className="h-5 w-5" />
                Upload New Dataset
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>
            <Link to="/help">
              <Button variant="outline" className="w-full justify-start gap-2" size="lg">
                <FileText className="h-5 w-5" />
                View Documentation
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
            <CardDescription>Your latest statistical calculations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">{analysis.name}</p>
                    <p className="text-xs text-muted-foreground">{analysis.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">AUC: {analysis.auc}</p>
                    <Link to="/results">
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                        View Results
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
