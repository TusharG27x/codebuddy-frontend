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
import { toast } from "react-toastify";

function EditorPage() {
  const [problem, setProblem] = useState("");
  const [code, setCode] = useState("// Write your code here...");
  const [helpType, setHelpType] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [testInput, setTestInput] = useState("");
  const [lastSaved, setLastSaved] = useState(null);

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

  // Handle hint/help request
  const handleHelp = () => {
    if (!problem.trim()) {
      toast.warn("Please enter or paste a problem statement ⚠️");
      return;
    }

    let response = "";
    switch (helpType) {
      case "hint":
        response = "💡 Hint: Break the problem into smaller subproblems.";
        break;
      case "debug":
        response =
          "🐞 Debug Tip: Try printing intermediate outputs to trace logic.";
        break;
      case "concept":
        response =
          "📘 Concept: Review recursion or dynamic programming for this type.";
        break;
      case "nextstep":
        response = "🚀 Next Step: Try optimizing your approach.";
        break;
      default:
        response = "🤖 Please select a help type.";
    }
    setAiResponse(response);
  };

  // Handle Run
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
    if (window.confirm("Reset all progress?")) {
      localStorage.removeItem("codebuddy-progress");
      setProblem("");
      setCode("// Write your code here...");
      setAiResponse("");
      setOutput("");
      setShowOutput(false);
      setLastSaved(null);
      toast.success("Progress reset 🧹");
    }
  };

  return (
    <Container className="py-4">
      <motion.h2
        className="text-center fw-bold text-primary mb-4"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        CodeBuddy Editor 💻
      </motion.h2>

      <Row>
        {/* Problem + AI Section */}
        <Col md={4}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  🧩 Problem Statement
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Paste your problem here..."
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  style={{ backgroundColor: "#fff", color: "#000" }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Select Help Type
                </Form.Label>
                <Form.Select
                  value={helpType}
                  onChange={(e) => setHelpType(e.target.value)}
                >
                  <option value="">-- Choose an option --</option>
                  <option value="hint">💡 Hint</option>
                  <option value="debug">🐞 Debug</option>
                  <option value="concept">📘 Concept</option>
                  <option value="nextstep">🚀 Next Step</option>
                </Form.Select>
              </Form.Group>

              <Button
                variant="primary"
                className="w-100 mb-3"
                onClick={handleHelp}
              >
                🤖 Get AI Help
              </Button>

              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h6 className="fw-bold text-success">AI Response:</h6>
                  <p className="mt-2">
                    {aiResponse || "AI suggestions will appear here..."}
                  </p>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>

        {/* Code Editor + Output */}
        <Col md={8}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              <h5 className="fw-semibold mb-2">💻 Code Editor</h5>
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <Editor
                  height="400px"
                  language="javascript"
                  value={code}
                  onChange={(val) => setCode(val)}
                  theme="vs-light"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    automaticLayout: true,
                  }}
                />
              </div>

              <Form.Group className="mt-3">
                <Form.Label className="fw-semibold">🧪 Custom Input</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Enter test input here..."
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <small className="text-muted">
                  {lastSaved ? `💾 Auto-saved at ${lastSaved}` : "No save yet"}
                </small>
                <div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="me-2"
                    onClick={handleReset}
                  >
                    🧹 Reset
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="me-2"
                    onClick={handleRun}
                  >
                    ▶ Run
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {showOutput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="mt-4 border-0 shadow-sm">
                      <Card.Header className="bg-light fw-semibold text-dark">
                        💻 Output
                      </Card.Header>
                      <Card.Body
                        style={{
                          backgroundColor: "#fff",
                          fontFamily: "monospace",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {loading ? (
                          <div className="text-center py-3">
                            <Spinner animation="border" variant="dark" />
                            <p className="mt-2">Running your code...</p>
                          </div>
                        ) : (
                          output || "⚙️ No output yet"
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
  );
}

export default EditorPage;
