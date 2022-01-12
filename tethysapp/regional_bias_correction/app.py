from tethys_sdk.base import TethysAppBase, url_map_maker


class RegionalBiasCorrection(TethysAppBase):
    """
    Tethys app class for Regional Bias Correction.
    """

    name = 'Regional Bias Correction'
    index = 'regional_bias_correction:home'
    icon = 'regional_bias_correction/images/icon.gif'
    package = 'regional_bias_correction'
    root_url = 'regional-bias-correction'
    color = '#2980b9'
    description = ''
    tags = ''
    enable_feedback = False
    feedback_emails = []

    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (
            UrlMap(
                name='home',
                url=f'{self.root_url}',
                controller=f'{self.package}.controllers.home'
            ),
            UrlMap(
                name='getBiasCorrected',
                url=f'{self.root_url}/getBiasCorrected',
                controller=f'{self.package}.controllers.request_data'
            )
        )

        return url_maps