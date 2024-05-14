from django.urls import path
from .views import QuizQuestionsAPIView

urlpatterns = [
    path('quiz/', QuizQuestionsAPIView.as_view(), name='quiz_questions_api'),
]