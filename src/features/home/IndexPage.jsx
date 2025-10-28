import { useState, useEffect } from "react";
import "./home.css";

import Step1 from "../../features/home/components/Step1";
import Step2 from "../../features/home/components/Step2";
import Step3 from "../../features/home/components/Step3";
import Step4 from "../../features/home/components/Step4";
import { getById } from "../../services/firebase/content";
import { CONTENT as DEFAULT_CONTENT } from "../../constants";

const IndexPage = () => {
  const steps = [Step1, Step2, Step3, Step4];
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(null);
  const [content, setContent] = useState(() =>
    JSON.parse(JSON.stringify(DEFAULT_CONTENT))
  );
  // Load content from Firestore (site_content) once on mount. We intentionally
  // don't block rendering — if Firestore returns data we merge it into state so
  // Steps receive updated content via prop.
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const doc = await getById("content", "site_content");
        if (!mounted) return;
        if (doc) {
          // merge with defaults and remove id
          const merged = { ...DEFAULT_CONTENT, ...doc };
          delete merged.id;
          setContent(merged);
        }
      } catch (err) {
        // silently ignore: keep DEFAULT_CONTENT
        console.error("Failed to load content from Firestore:", err);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);
  const nextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };
  const StepComponent = steps[currentStep];
  const total = steps.length;
  const percent =
    total > 1 ? Math.round((currentStep / (total - 1)) * 100) : 100;
  return (
    <div className="home">
      <div
        className="app-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div className="app-title">Luxury Star Spa</div>
          <div className="app-progress">
            Paso {currentStep + 1} de {total}
          </div>
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
            content={content}
          />
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
