from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.views.decorators.csrf import csrf_protect
from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
from django.utils.dateformat import DateFormat
from django.template.backends.django import Template
from django.template.backends.django import Context
from django.conf import settings
from core.forms import *



def index(request):
    template = loader.get_template('core/index.html')
    context = {'CLINICAL': settings.CLINICAL}
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
    variables = RequestContext(request, {'form': form, 'CLINICAL': settings.CLINICAL})

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
    # retrieve user
    user = request.user
    if request.method == 'POST':
        form = UpdateProfileForm(request.POST)
        if form.is_valid():
            # set new values
            user.set_password(form.cleaned_data['password1'])
            user.email=form.cleaned_data['email']
            user.profile.birth_date = form.cleaned_data['birth_date']
            user.profile.gender = form.cleaned_data['gender']
            user.save()

            update_session_auth_hash(request, request.user)

            return HttpResponseRedirect('/update/success/')
    else:
        form = UpdateProfileForm(initial={'email': user.email,
                                          'birth_date': DateFormat(user.profile.birth_date).format('d/m/Y'),
                                          'gender': user.profile.gender,
                                          'CLINICAL': settings.CLINICAL})
    variables = RequestContext(request, {'form': form})

    return render_to_response(
        'update.html',
        variables,
    )

def about(request):

    return render_to_response(
        'about.html',
        {'CLINICAL': settings.CLINICAL}
    )


def wait(request):

    def get_game_label(x):
        return {
            'trust': "Trust",
            'ultimatum': 'Ultimatum',
            'peacewar': 'Two Leaders',
            'chat': 'Chat',
            'prisoner': "Prisoner Dilemma",
            'bargaining': "Bargaining",
            'public_goods': "Public Goods",
            'dictator': "Dictator"
        }[x]

    def get_instructions(x):
        if x == "trust":
            from games.trust.models import Constants
        elif x == "peacewar":
            from games.peacewar.models import Constants
        elif x == "ultimatum":
            from games.ultimatum.models import Constants
        elif x == 'chat':
            from games.chat.models import Constants
        elif x == 'dictator':
            from games.dictator.models import Constants
        elif x == 'public_goods':
            from games.public_goods.models import Constants
        elif x == 'bargaining':
            from games.bargaining.models import Constants
        elif x == 'prisoner':
            from games.prisoner.models import Constants
        t = loader.get_template(Constants.instructions_template)
        c = Context({"Constants": Constants.__dict__,
                     'CLINICAL': settings.CLINICAL})

        return t.render(c)

    game = request.GET.get('game')
    game_label = get_game_label(game)
    instructions = get_instructions(game)

    return render_to_response(
        'wait.html',
        {'game': game, 'game_label': game_label, 'instructions': instructions, 'CLINICAL': settings.CLINICAL}
    )
