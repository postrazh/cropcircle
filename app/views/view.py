
from django.views.generic import ListView
from ..models import FieldTesting

class ViewView(ListView):
    model = FieldTesting
    template_name = 'view.html'
    context_object_name = 'rows'

    def get_queryset(self):
        return self.model.objects.all()