// Configuration pour Vite (utilisez cette version si vous utilisez Vite)
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// OU pour Create React App (décommentez si vous utilisez CRA)
// const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default {
  async getSubjects(studentId) {
    try {
      const response = await fetch(`${BASE_URL}/students/${studentId}/subjects`);
      if (!response.ok) throw new Error('Erreur réseau');
      return await response.json();
    } catch (error) {
      console.error("Erreur dans getSubjects:", error);
      throw error;
    }
  },

  async getStudentSubmissions(studentId) {
    try {
      const response = await fetch(`${BASE_URL}/students/${studentId}/submissions`);
      if (!response.ok) throw new Error('Erreur réseau');
      return await response.json();
    } catch (error) {
      console.error("Erreur dans getStudentSubmissions:", error);
      throw error;
    }
  },

  async submitAssignment(studentId, subjectId, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${BASE_URL}/submissions`, {
        method: 'POST',
        body: formData,
        headers: {
          'student-id': studentId,
          'subject-id': subjectId
        }
      });

      if (!response.ok) throw new Error('Erreur lors de la soumission');
      return await response.json();
    } catch (error) {
      console.error("Erreur dans submitAssignment:", error);
      throw error;
    }
  },

  async withdrawSubmission(submissionId) {
    try {
      const response = await fetch(`${BASE_URL}/submissions/${submissionId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Erreur lors du retrait');
      return await response.json();
    } catch (error) {
      console.error("Erreur dans withdrawSubmission:", error);
      throw error;
    }
  }
};