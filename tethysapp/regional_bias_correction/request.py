import os
from glob import glob
import netCDF4 as nc


def get_data(request: dict):
    archive = ''
    start_date = request.start_date
    archive_dataset = nc.Dataset(archive, mode='r')
    datetime = archive_dataset.variables['datetime'][start_date:, request.lat, request.lon, request.reach_id]
    original_flow = archive_dataset.variables['original_flow'][start_date:, request.lat, request.lon, request.reach_id]
    bias_corrected_flow = archive_dataset.variables['bias_corrected_flow'][start_date:, request.lat, request.lon, request.reach_id]
    response = {
        'datetime': datetime,
        'original_flow': original_flow,
        'bias_corrected_flow': bias_corrected_flow,
        'reachid': request.reach_id,
        'lat': request.lat,
        'lon': request.lon
    }
    return response
