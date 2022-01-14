import os
from glob import glob
import netCDF4 as nc


def get_data(request):
    archive = ''
    start_date = request.start_date
    lat = float(request.lat)
    lon = float(request.lon)
    reach_id = float(request.reach_id)
    archive_dataset = nc.Dataset(archive, mode='r')
    datetime = archive_dataset['datetime'][start_date:, lat, lon, reach_id]
    original_flow = archive_dataset['original_flow'][start_date:, lat, lon, reach_id]
    bias_corrected_flow = archive_dataset['bias_corrected_flow'][start_date:, lat, lon, reach_id]
    response = {
        'datetime': datetime,
        'original_flow': original_flow,
        'bias_corrected_flow': bias_corrected_flow,
        'reachid': request.reach_id,
        'lat': request.lat,
        'lon': request.lon
    }
    return response
