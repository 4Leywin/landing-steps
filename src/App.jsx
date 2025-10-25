import { useState } from "react";
import "./App.css";
import Step1 from "./features/home/components/Step1";
import Step2 from "./features/home/components/Step2";
import Step3 from "./features/home/components/Step3";
import Step4 from "./features/home/components/Step4";

function App() {
  const steps = [Step1, Step2, Step3, Step4];
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(null);
  const nextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };
  const StepComponent = steps[currentStep];
  const total = steps.length;
  const percent =
    total > 1 ? Math.round((currentStep / (total - 1)) * 100) : 100;
  return (
    <div className="App">
      <div className="app-header">
        <div className="app-title">Luxury Star Spa</div>
        <div className="app-progress">
          Paso {currentStep + 1} de {total}
        </div>
      </div>

      <div className="progress-track" aria-hidden>
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>

      <div className="steps-container">
        <div className="step-card">
          <StepComponent
            nextStep={nextStep}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
