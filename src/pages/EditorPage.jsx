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
// --- 1. Use react-hot-toast (to match other pages) ---
import toast from "react-hot-toast";
// --- 2. Imports for API Call ---
import axios from "axios";
// We import useAuth to make sure we're logged in, even though we don't use the object
// This page is already protected by ProtectedRoute, so we're good.

function EditorPage() {
  const [problem, setProblem] = useState("");
  const [code, setCode] = useState("// Write your code here...");
  const [helpType, setHelpType] = useState("hint"); // Default to 'hint'
  const [aiResponse, setAiResponse] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false); // For Run button
  const [showOutput, setShowOutput] = useState(false);
  const [testInput, setTestInput] = useState("");
  const [lastSaved, setLastSaved] = useState(null);

  // --- 3. New state for AI loading ---
  const [aiLoading, setAiLoading] = useState(false);

  // Load saved data (unchanged)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("codebuddy-progress"));
    if (saved) {
      setProblem(saved.problem || "");
      setCode(saved.code || "// Write your code here...");
      setLastSaved(saved.lastSaved || null);
    }
  }, []);

  // Auto-save (unchanged)
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

  // --- 4. This is the updated AI Help handler ---
  const handleHelp = async () => {
    if (!code.trim() || code === "// Write your code here...") {
      toast.warn("Please write some code for the AI to analyze ⚠️");
      return;
    }

    setAiLoading(true);
    setAiResponse(""); // Clear previous response

    try {
      const { data } = await axios.post(
        `${API_URL}/api/ai/get-hint`,
        { code, problem },
        { withCredentials: true } // Essential for our protected route
      );

      // On success, set the AI response
      setAiResponse(data.hint);
      setAiLoading(false);
    } catch (error) {
      console.error("AI Hint Error:", error);
      toast.error("Failed to get hint from AI. Please try again.");
      setAiResponse("Sorry, I couldn't generate a hint right now.");
      setAiLoading(false);
    }
  };

  // Handle Run (unchanged - this is still a mock)
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

  // --- 5. Updated Reset (Removed 'window.confirm') ---
  const handleReset = () => {
    // We remove the confirm popup, as it's blocking
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

              {/* --- 6. Simplified the AI Help section --- */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Stuck? Get an AI Hint
                </Form.Label>
                <Form.Text className="d-block mb-2 text-muted">
                  Our AI will analyze your code (right) and give you a small
                  hint, not the whole answer.
                </Form.Text>
              </Form.Group>

              {/* --- 7. Updated AI Help Button --- */}
              <Button
                variant="primary"
                className="w-100 mb-3"
                onClick={handleHelp}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" />{" "}
                    Generating...
                  </>
                ) : (
                  "🤖 Get AI Hint"
                )}
              </Button>

              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h6 className="fw-bold text-success">AI Response:</h6>
                  {/* --- 8. Updated AI Response Box --- */}
                  {aiLoading ? (
                    <div className="text-center py-3">
                      <Spinner animation="border" variant="dark" size="sm" />
                      <p className="mt-2 mb-0 small">
                        CodeBuddy is thinking...
                      </p>
                    </div>
                  ) : (
                    <p className="mt-2" style={{ whiteSpace: "pre-wrap" }}>
                      {aiResponse || "AI suggestions will appear here..."}
                    </p>
                  )}
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>

        {/* Code Editor + Output (This side is unchanged) */}
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
                  language="python"
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
