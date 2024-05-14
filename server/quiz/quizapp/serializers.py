from rest_framework import serializers

class QuizQuestionSerializer(serializers.Serializer):
    category = serializers.CharField()
    type = serializers.CharField()
    difficulty = serializers.CharField()
    question = serializers.CharField()
    correct_answer = serializers.CharField()
    incorrect_answers = serializers.ListField(child=serializers.CharField())