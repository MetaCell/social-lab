from django.shortcuts import render
from core.forms import *
from django.http import HttpResponse
from django.template import loader
from django.views.decorators.csrf import csrf_protect
from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect
from django.template import RequestContext


def index(request):
    template = loader.get_template('core/index.html')
    context = {}
    return HttpResponse(template.render(context, request))


@csrf_protect
def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = User.objects.create_user(
                username=form.cleaned_data['username'],
                password=form.cleaned_data['password1'],
                email=form.cleaned_data['email']
            )
            return HttpResponseRedirect('/register/success/')
    else:
        form = RegistrationForm()
    variables = RequestContext(request, {
        'form': form
    })

    return render_to_response(
        'register.html',
        variables,
    )


def register_success(request):
    return render_to_response(
        'success.html',
    )
