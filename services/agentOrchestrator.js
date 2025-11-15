// const { askGemini } = require('./geminiService');

const chooseAgent = async ({ question }) => {
  // Temporarily route all queries to OpenAI only
  return await askOpenAI(question);

  // Future logic for multi-agent selection:
  // if (someCondition) return await askGemini(question);
};
