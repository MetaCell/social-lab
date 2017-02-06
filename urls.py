"""sociallab URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""

from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.views.generic import TemplateView
from otree.default_urls import urlpatterns
from core.views import *

urlpatterns.append(url(r'^$', include('core.urls')))
urlpatterns.append(url(r'^admin/', admin.site.urls))
urlpatterns.append(url(r'^login/$', auth_views.login, {'template_name': 'login.html'}, name='login'))
urlpatterns.append(url(r'^logout/$', auth_views.logout, index, name='index'))
urlpatterns.append(url(r'^register/$', register, name='register'))
urlpatterns.append(url(r'^register/success/$', register_success, name='register_success'))
urlpatterns.append(url(r'^update/$', update, name='update'))
urlpatterns.append(url(r'^update/success/$', index, name='index'))
urlpatterns.append(url(r'^wait/$', wait, name='wait'))
urlpatterns.append(url(r'^about/$', TemplateView.as_view(template_name="about.html"), name='about'))