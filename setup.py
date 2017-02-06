import os
import sys
from setuptools import setup, find_packages

README = open(os.path.join(os.path.dirname(__file__), 'README.md')).read()

# allow setup.py to be run from any path
os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

exec(open('version.py').read())


def get_requirements():
    reqs = []
    for filename in ["requirements_base.txt","requirements_heroku.txt"]:
        with open(filename, "r") as f:
            reqs += [x.strip() for x in f.readlines() if x.strip() and not x.strip().startswith("#") and not x.strip().startswith("-r")]
    return reqs

if sys.argv[-1] == 'publish':

    cmd = "python setup.py sdist upload"
    print(cmd)
    os.system(cmd)

    cmd = 'git tag -a %s -m "version %s"' % (version, version)
    print(cmd)
    os.system(cmd)

    cmd = "git push --tags"
    print(cmd)
    os.system(cmd)

    sys.exit()


setup(
    name='social-lab',
    version=__version__,
    include_package_data=True,
    license='MIT License',

    # this was not working right. did not exclude
    # otree.app_template._builtin for some reason. so instead i use
    # recursive-exclude in MANIFEST.in
    packages=find_packages(),
    description=(
        'Social Lab is...'
    ),
    long_description=README,
    url='http://social-lab.org/',
    install_requires=get_requirements(),
    classifiers=[
        'Environment :: Web Environment',
        'Framework :: Django',
        'Framework :: Django :: 1.8',
        'Intended Audience :: Developers',
        # example license
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
    ],
    entry_points={
        'console_scripts': [
            'sociallab=sociallab.management.cli:sociallab_cli',
        ],
    },

    zip_safe=False,
)
