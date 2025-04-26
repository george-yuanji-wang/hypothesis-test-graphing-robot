// src/App.tsx
import { useEffect, useState } from "react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { initPyodide } from "./pyodideLoader"

// Import your form components:
import OneSampleTForm from "./components/forms/OneSampleTForm"
import OneSampleZForm from "./components/forms/OneSampleZForm"
import OneSampleProportionZForm from "./components/forms/OneSampleProportionZForm"
// import TwoDependentZForm from "./components/forms/TwoDependentZForm"
import TwoDependentTForm from "./components/forms/TwoDependentTForm"
// import TwoDependentProportionForm from "./components/forms/TwoDependentProportionForm"
import TwoIndependentZForm from "./components/forms/TwoIndependentZForm"
import TwoIndependentTForm from "./components/forms/TwoIndependentTForm"
import TwoIndependentProportionForm from "./components/forms/TwoIndependentProportionForm"
import ChiSquareGofForm from "./components/forms/ChiSquareGofForm"
import ChiSquareIndependenceForm from "./components/forms/ChiSquareIndependenceForm"
import ChiSquareHomogeneityForm from "./components/forms/ChiSquareHomogeneityForm"

export default function MainContent() {
  const [pyReady, setPyReady] = useState(false)

  useEffect(() => {
    initPyodide().then(() => setPyReady(true))
  }, [])

  if (!pyReady) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-2xl text-center">Loading Python environment...</h1>
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Tabs defaultValue="oneSampleT" className="flex-grow flex flex-col">
        {/* Header */}
        <header className="w-full max-w-3xl mx-auto p-4">
          <h1 className="text-4xl font-bold text-center mb-8">
            Hypothesis Test Plotter
          </h1>
          <p className="text-center text-xs mb-10 text-gray-400">
          This tool is specifically designed to automatically generate graphs and plots that meet the AP Statistics Semester 2 project’s requirements. This software is provided “as is,” without any warranty of any kind. The author accepts no liability for errors, omissions, or misuse of the tool. Users should verify the results themselves.
          </p>

          <TabsList className="grid grid-cols-3 gap-4">
            <TabsTrigger value="oneSampleT">One-Sample T</TabsTrigger>
            <TabsTrigger value="oneSampleZ">One-Sample Z</TabsTrigger>
            <TabsTrigger value="oneSamplePropZ">One-Sample Prop Z</TabsTrigger>
            {/*<TabsTrigger value="twoDepZ">2-Dependent Z</TabsTrigger>*/}
            <TabsTrigger value="twoDepT">2-Dependent T</TabsTrigger>
            {/*<TabsTrigger value="twoDepProp">2-Dependent Prop</TabsTrigger>*/}
            <TabsTrigger value="twoIndZ">2-Independent Z</TabsTrigger>
            <TabsTrigger value="twoIndT">2-Independent T</TabsTrigger>
            <TabsTrigger value="twoIndPropZ">2-Independent Prop Z</TabsTrigger>
            <TabsTrigger value="chiGOF">Chi-Square Goodness of Fit test</TabsTrigger>
            <TabsTrigger value="chiIND">Chi-Square Independence test</TabsTrigger>
            <TabsTrigger value="chiHOM">Chi-Square Test of Homogeneity</TabsTrigger>
            
          </TabsList>
        </header>

        {/* Main content area */}
        <main className="w-full max-w-3xl mt-40 mx-auto p-4 flex-grow">
          <TabsContent value="oneSampleT" className="mt-4">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>One-Sample T-Test</CardTitle>
                <CardDescription>
                  Enter parameters and click "Solve" to generate the plot.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <OneSampleTForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="oneSampleZ" className="mt-4">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>One-Sample Z-Test</CardTitle>
                <CardDescription>
                  Enter parameters and click "Solve" to generate the plot.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <OneSampleZForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="oneSamplePropZ" className="mt-4">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>One-Sample Proportion Z-Test</CardTitle>
                <CardDescription>
                  Enter parameters and click "Solve" to generate the plot.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <OneSampleProportionZForm />
              </CardContent>
            </Card>
          </TabsContent>

          {/*
          <TabsContent value="twoDepZ" className="mt-4">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>2-Dependent Z-Test</CardTitle>
                <CardDescription>
                  Enter parameters and click "Solve" to generate the plot.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TwoDependentZForm />
              </CardContent>
            </Card>
          </TabsContent>
          */}

          <TabsContent value="twoDepT" className="mt-4">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>2-Dependent T-Test</CardTitle>
                <CardDescription>
                  Enter parameters and click "Solve" to generate the plot.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TwoDependentTForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/*
          <TabsContent value="twoDepProp" className="mt-4">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>2-Dependent Proportion Test</CardTitle>
                <CardDescription>
                  Enter parameters and click "Solve" to generate the plot.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TwoDependentProportionForm />
              </CardContent>
            </Card>
          </TabsContent>
          */}

          <TabsContent value="twoIndZ" className="mt-4">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>2-Independent Z-Test</CardTitle>
                <CardDescription>
                  Enter parameters and click "Solve" to generate the plot.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TwoIndependentZForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="twoIndT" className="mt-4">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>2-Independent T-Test</CardTitle>
                <CardDescription>
                  Enter parameters and click "Solve" to generate the plot.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TwoIndependentTForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="twoIndPropZ" className="mt-4">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>2-Independent Proportion Z-Test</CardTitle>
                <CardDescription>
                  Enter parameters and click "Solve" to generate the plot.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TwoIndependentProportionForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chiGOF" className="mt-4">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Chi-Square Goodness of Fit test</CardTitle>
                <CardDescription>
                  Enter parameters and click "Solve" to generate the plot.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ChiSquareGofForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chiIND" className="mt-4">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Chi-Square Independence test</CardTitle>
                <CardDescription>
                  Enter parameters and click "Solve" to generate the plot.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ChiSquareIndependenceForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chiHOM" className="mt-4">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Chi-Square Test of Homogeneity</CardTitle>
                <CardDescription>
                  Enter parameters and click "Solve" to generate the plot.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ChiSquareHomogeneityForm />
              </CardContent>
            </Card>
          </TabsContent>

        </main>
      </Tabs>

      <div className="w-full max-w-3xl mx-auto p-4 mt-8 text-gray-400">
        <h2 className="text-3xl font-bold mb-4">Updates:</h2>
        <div className="text-sm">
          <div className="py-2">
            <span className="font-semibold">April 26, 2025</span> - Added support for the Chi-Square Homogeneity test and the Chi-Square.
          </div>
          <div className="py-2">
            <span className="font-semibold">April 22, 2025</span> - Added support for the Chi-Square Goodness of Fit test and the Chi-Square Independence Test. Fixed minor bugs.
          </div>
          <div className="py-2 pl-4">
            <span className="font-semibold">March 23, 2025</span> - Initial setup: included nine hypothesis tests for means and proportions. Created the pipeline for plotting and the flexible information box.
          </div>
        </div>
      </div>


      <footer className="p-4 text-center text-sm opacity-80">
        Created by <span className="font-semibold">George Wang</span>
      </footer>
    </div>
  )
}
