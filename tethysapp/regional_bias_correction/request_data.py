import numpy as np
import pandas as pd
import netCDF4 as nc
import datetime as dt
import plotly.graph_objects as go


def get_data(request):
    archive = '/Users/jonahdundas/Downloads/calibrated_simulated_flow.nc'
    lat = float(request.GET.get('lat'))
    lon = float(request.GET.get('lon'))
    reach_id = int(request.GET.get('reachid'))
    archive_dataset = nc.Dataset(archive, mode='r')
    reachid_index = abs(archive_dataset['model_id'][:] - reach_id).argmin()
    origin_date = dt.datetime(year=1970, month=1, day=1)
    time_numbers = archive_dataset['time'][:]
    dates = pd.to_datetime([origin_date + dt.timedelta(days=int(i)) for i in time_numbers])
    datetime = dates.strftime("%Y/%m/%d, %H:%M:%S").tolist()
    original_flow = archive_dataset['flow_sim'][:, reachid_index].tolist()
    bias_corrected_flow = archive_dataset['flow_bc'][:, reachid_index].tolist()
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
    return response