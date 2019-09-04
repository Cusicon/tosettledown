module['exports'] = {

    /*
     * The disk on which to store added files and derived images by default. Choose
     * one or more of the disks you've configured in config/filesystems.php.
     */
    'disk_name': get_env('MEDIA_DISK', 'public'),

    /*
     * The name of the media model.
     */
    'media_model': 'media',

    'responsive_images': {

        /*
        * This class is responsible for calculating the target widths of the responsive
        * images. By default we optimize for filesize and create variations that each are 20%
        * smaller than the previous one. More info in the documentation.
        *
        * https://docs.spatie.be/laravel-medialibrary/v7/advanced-usage/generating-responsive-images
        */

        /*
         * The path where to store temporary files while performing image conversions.
         * If set to null, storage_path('medialibrary/temp') will be used.
         */
        'temporary_directory_path': null,
    }
}