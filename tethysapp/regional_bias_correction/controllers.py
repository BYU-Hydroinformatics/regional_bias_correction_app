from django.shortcuts import render
from tethys_sdk.permissions import login_required


@login_required()
def home(request):
    """
    Controller for the app home page.
    """
    context = {
    }

    return render(request, 'regional_bias_correction/home.html', context)


def functionthatgetsdataforthefrontend(reach_id, lat, lon):
    # do this in a normal .py file not part of tethys
    # read from a netcdf file
    # get data using the geoglows package etc
    # make the dictionary/json object that the js function you wrote is expecting to receive
    return
