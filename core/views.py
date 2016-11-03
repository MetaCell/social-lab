from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.views.decorators.csrf import csrf_protect
from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
from core.forms import *
from core.models import Profile


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

            user.profile.birth_date = form.cleaned_data['birth_date']
            user.profile.gender = form.cleaned_data['gender']
            user.save()

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

@login_required(login_url='/login/')
def update(request):
    if request.method == 'POST':
        form = UpdateProfileForm(request.POST)
        if form.is_valid():
            # retrieve user
            user = request.user
            # set new values
            user.set_password(form.cleaned_data['password1'])
            user.email=form.cleaned_data['email']
            user.profile.birth_date = form.cleaned_data['birth_date']
            user.profile.gender = form.cleaned_data['gender']
            user.save()

            update_session_auth_hash(request, request.user)

            return HttpResponseRedirect('/update/success/')
    else:
        form = UpdateProfileForm()
    variables = RequestContext(request, {
        'form': form
    })

    return render_to_response(
        'update.html',
        variables,
    )
