from django.shortcuts import render
from django.http import JsonResponse, HttpResponseNotAllowed
from tethys_sdk.permissions import login_required
from tethys_sdk.gizmos import Button
# from .request_data import get_data
import numpy as np
import pandas as pd
import netCDF4 as nc
import datetime as dt

@login_required()
def home(request):
    """
    Controller for the app home page.
    """
    save_button = Button(
        display_text='',
        name='save-button',
        icon='glyphicon glyphicon-floppy-disk',
        style='success',
        attributes={
            'data-toggle':'tooltip',
            'data-placement':'top',
            'title':'Save'
        }
    )

    edit_button = Button(
        display_text='',
        name='edit-button',
        icon='glyphicon glyphicon-edit',
        style='warning',
        attributes={
            'data-toggle':'tooltip',
            'data-placement':'top',
            'title':'Edit'
        }
    )

    remove_button = Button(
        display_text='',
        name='remove-button',
        icon='glyphicon glyphicon-remove',
        style='danger',
        attributes={
            'data-toggle':'tooltip',
            'data-placement':'top',
            'title':'Remove'
        }
    )

    previous_button = Button(
        display_text='Previous',
        name='previous-button',
        attributes={
            'data-toggle':'tooltip',
            'data-placement':'top',
            'title':'Previous'
        }
    )

    next_button = Button(
        display_text='Next',
        name='next-button',
        attributes={
            'data-toggle':'tooltip',
            'data-placement':'top',
            'title':'Next'
        }
    )

    context = {
        'save_button': save_button,
        'edit_button': edit_button,
        'remove_button': remove_button,
        'previous_button': previous_button,
        'next_button': next_button
    }

    return render(request, 'regional_bias_correction/home.html', context)


@login_required()
def request_data(request):
    json_response = {'success': False}
    request = request.GET

    archive = '/Users/jonahdundas/Downloads/calibrated_simulated_flow.nc'
    lat = float(request.__getitem__('lat'))
    lon = float(request.__getitem__('lon'))
    reach_id = float(request.__getitem__('reachid'))
    archive_dataset = nc.Dataset(archive, mode='r')
    reachid_index = abs(archive_dataset['model_id'][:] - reach_id).argmin()
    origin_date = dt.datetime(year=1970, month=1, day=1)
    time_numbers = archive_dataset['time'][:]
    dates = pd.to_datetime([origin_date + dt.timedelta(days=int(i)) for i in time_numbers])
    datetime = dates.strftime("%Y/%m/%d, %H:%M:%S").tolist()
    original_flow = archive_dataset['flow_sim'][:, reachid_index].tolist()
    print(original_flow)
    bias_corrected_flow = archive_dataset['flow_bc'][:, reachid_index].tolist()
    print(bias_corrected_flow)
    lat = str(lat)
    lon = str(lon)
    reach_id = str(reach_id)
    response = {
        'datetime': datetime,
        'original_flow': original_flow,
        'bias_corrected_flow': bias_corrected_flow,
        'reachid': reach_id,
        'lat': lat,
        'lon': lon
    }

    archive_dataset.close()
    # response = request_data.get_data(request)
    json_response.update(response)
    json_response.update({'success': True})

    return JsonResponse(json_response)