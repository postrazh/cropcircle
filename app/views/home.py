
from django.views.generic import View, TemplateView
from django.http import Http404, HttpResponseRedirect
from django.urls import reverse_lazy

class HomeView(View):
    def get(self, request):
        return HttpResponseRedirect(reverse_lazy('view'))

# class HomeView(TemplateView):
#     template_name = 'index.html'