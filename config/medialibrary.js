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
         * The path where to store temporary files while performing image conversions.
         * If set to null, storage_path('medialibrary/temp') will be used.
         */
        'temporary_directory_path': storage_path('medialibrary/temp'),

        'option' : {
            'thumbnail':{
                width : 80,
                height : 80,
                name: 'thumbnail'
            },
            'profile':{
                width : 400,
                height : 400,
                name: 'profile'
            },
            'encounter':{
                width : 800,
                height : 800,
                name: 'encounter'
            }
        }
    }
}