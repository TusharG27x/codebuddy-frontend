// src/pages/EditorPage.jsx
import API_URL from "../apiConfig";
import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";

function EditorPage() {
  const [problem, setProblem] = useState("");
  const [code, setCode] = useState("// Write your code here...");
  const [helpType, setHelpType] = useState("hint");
  const [aiResponse, setAiResponse] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [testInput, setTestInput] = useState("");
  const [lastSaved, setLastSaved] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Load saved data
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("codebuddy-progress"));
    if (saved) {
      setProblem(saved.problem || "");
      setCode(saved.code || "// Write your code here...");
      setLastSaved(saved.lastSaved || null);
    }
  }, []);

  // Auto-save
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (problem.trim() || code.trim()) {
        const data = {
          problem,
          code,
          lastSaved: new Date().toLocaleTimeString(),
        };
        localStorage.setItem("codebuddy-progress", JSON.stringify(data));
        setLastSaved(data.lastSaved);
      }
    }, 1200);
    return () => clearTimeout(timeout);
  }, [problem, code]);

  // Handle AI Help
  const handleHelp = async () => {
    if (!code.trim() || code === "// Write your code here...") {
      toast.warn("Please write some code for the AI to analyze ⚠️");
      return;
    }

    setAiLoading(true);
    setAiResponse("");

    try {
      const { data } = await axios.post(
        `${API_URL}/api/ai/get-hint`,
        { code, problem },
        { withCredentials: true },
      );

      setAiResponse(data.hint);
      setAiLoading(false);
    } catch (error) {
      console.error("AI Hint Error:", error);
      toast.error("Failed to get hint from AI. Please try again.");
      setAiResponse("Sorry, I couldn't generate a hint right now.");
      setAiLoading(false);
    }
  };

  // Handle Run (mock)
  const handleRun = () => {
    if (!code.trim() || code === "// Write your code here...") {
      toast.warn("Please write some code before running ⚙️");
      return;
    }
    setLoading(true);
    setShowOutput(true);
    setTimeout(() => {
      const result = testInput
        ? `✅ Output for input "${testInput}": ${testInput.length * 2}`
        : "✅ Code executed successfully!\nOutput: 42";
      setOutput(result);
      setLoading(false);
      toast.success("Execution complete!");
    }, 1800);
  };

  // Handle Reset
  const handleReset = () => {
    localStorage.removeItem("codebuddy-progress");
    setProblem("");
    setCode("// Write your code here...");
    setAiResponse("");
    setOutput("");
    setShowOutput(false);
    setLastSaved(null);
    toast.success("Progress reset 🧹");
  };

  return (
    <div
      className="bg-light"
      style={{ minHeight: "100vh", paddingBottom: "3rem" }}
    >
      <Container className="py-5">
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="fw-bolder mb-2" style={{ color: "#1e293b" }}>
            CodeBuddy Editor 💻
          </h2>
          <p className="text-secondary fs-5">
            Solve problems and get intelligent hints.
          </p>
        </motion.div>

        <Row className="g-4">
          {/* Left Panel: Problem + AI Section */}
          <Col lg={4}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="d-flex flex-column">
                <Form.Group className="mb-4">
                  <Form.Label
                    className="fw-bold mb-2"
                    style={{ color: "#1e293b" }}
                  >
                    🧩 Problem Statement
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Paste your problem here..."
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="bg-light border-0 shadow-none"
                    style={{ resize: "none" }}
                  />
                </Form.Group>

                <hr className="text-muted opacity-25" />

                <div className="mt-2 mb-4">
                  <Form.Label
                    className="fw-bold mb-1"
                    style={{ color: "#1e293b" }}
                  >
                    Stuck? Get an AI Hint
                  </Form.Label>
                  <Form.Text className="d-block mb-3 text-secondary">
                    Our AI will analyze your code and provide a logical stepping
                    stone, not the whole answer.
                  </Form.Text>
                  <Button
                    variant="primary"
                    className="w-100 py-2 fw-semibold shadow-sm"
                    onClick={handleHelp}
                    disabled={aiLoading}
                  >
                    {aiLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Analyzing Code...
                      </>
                    ) : (
                      "🤖 Get AI Hint"
                    )}
                  </Button>
                </div>

                {/* Styled AI Response Box */}
                {(aiResponse || aiLoading) && (
                  <div className="mt-auto">
                    <h6 className="fw-bold text-success mb-2">AI Response:</h6>
                    <div className="bg-primary-subtle border-start border-primary border-4 rounded p-3">
                      {aiLoading ? (
                        <div className="d-flex align-items-center text-primary">
                          <Spinner
                            animation="grow"
                            size="sm"
                            className="me-2"
                          />
                          <small className="fw-semibold">Thinking...</small>
                        </div>
                      ) : (
                        <p
                          className="mb-0 text-dark"
                          style={{
                            whiteSpace: "pre-wrap",
                            fontSize: "0.95rem",
                          }}
                        >
                          {aiResponse}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Right Panel: Code Editor + Output */}
          <Col lg={8}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0" style={{ color: "#1e293b" }}>
                    💻 Code Editor
                  </h5>
                  <small className="text-muted fw-semibold">
                    {lastSaved
                      ? `💾 Auto-saved at ${lastSaved}`
                      : "No save yet"}
                  </small>
                </div>

                <div
                  className="flex-grow-1"
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    overflow: "hidden",
                    minHeight: "400px",
                  }}
                >
                  <Editor
                    height="100%"
                    language="python"
                    value={code}
                    onChange={(val) => setCode(val)}
                    theme="vs-light"
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      automaticLayout: true,
                      padding: { top: 16 },
                    }}
                  />
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="fw-semibold px-3"
                    onClick={handleReset}
                  >
                    🧹 Reset Editor
                  </Button>
                </div>

                <AnimatePresence>
                  {showOutput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Card className="mt-4 border-0 bg-light">
                        <Card.Header
                          className="bg-light border-bottom-0 pt-3 pb-0 fw-bold"
                          style={{ color: "#1e293b" }}
                        >
                          💻 Output
                        </Card.Header>
                        <Card.Body
                          style={{
                            fontFamily: "monospace",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {loading ? (
                            <div className="text-center py-2">
                              <Spinner
                                animation="border"
                                variant="secondary"
                                size="sm"
                              />
                              <span className="ms-2 text-secondary">
                                Running code...
                              </span>
                            </div>
                          ) : (
                            <span className="text-dark">
                              {output || "⚙️ No output yet"}
                            </span>
                          )}
                        </Card.Body>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default EditorPage;
