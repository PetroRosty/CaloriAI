export interface FeedbackData {
  type: string;
  name: string;
  email: string;
  message: string;
}

export const sendFeedback = async (data: FeedbackData): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Ошибка отправки сообщения');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Feedback submission error:', error);
    return { success: false, error: error.message };
  }
}; 