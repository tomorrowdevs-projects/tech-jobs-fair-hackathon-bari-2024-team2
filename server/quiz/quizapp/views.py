from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
from .serializers import QuizQuestionSerializer

class QuizQuestionsAPIView(APIView):
    def get(self, request):
        response = requests.get('https://opentdb.com/api.php?amount=10')
        data = response.json()
        serializer = QuizQuestionSerializer(data=data['results'], many=True)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)
