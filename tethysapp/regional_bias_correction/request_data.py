import netCDF4 as nc
import datetime as dt


def get_data(request):
    archive = '/Users/jonahdundas/Downloads/calibrated_simulated_flow.nc'

    # lat = float(request.lat)
    # lon = float(request.lon)
    reach_id = float(request['reachid'])
    archive_dataset = nc.Dataset(archive, mode='r')
    reachid_index = abs(archive_dataset['model_id'][:] - reach_id).argmin()
    origin_date = dt.datetime(year=1970, month=1, day=1)
    time_numbers = archive_dataset['time'][:]
    dates = [origin_date + dt.timedelta(days=int(i)) for i in time_numbers]
    datetime = dates.strftime("%Y/%m/%d, %H:%M:%S")
    original_flow = archive_dataset['flow_sim'][:, reachid_index]
    print(original_flow)
    bias_corrected_flow = archive_dataset['flow_bc'][:, reachid_index]
    print(bias_corrected_flow)
    response = {
        'datetime': datetime,
        'original_flow': original_flow,
        'bias_corrected_flow': bias_corrected_flow,
        'reachid': request.reach_id,
        # 'lat': lat,
        # 'lon': lon
    }
    archive_dataset.close()
    return response
