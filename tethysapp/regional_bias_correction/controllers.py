from django.shortcuts import render
from django.http import JsonResponse, HttpResponseNotAllowed
from tethys_sdk.permissions import login_required
from tethys_sdk.gizmos import Button
from . import request_data

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

def request_data(request):
    json_response = {'success': False}

    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])
    try:
        response = request_data.get_data(request)
        json_response.update(response)
        json_response.update({'success': True})
    except Exception as e:
        json_response['error'] = f'The following error has occurred:\n' \
                                 f'{e}\n' \
                                 f'Please try again.'
    return JsonResponse(json_response)