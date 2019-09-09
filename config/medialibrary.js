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
    'temporary_directory_path': storage_path('medialibrary/temp'),
    'manipulation' : {
        width : 800,
        height : 800,
        quality: 100,
    },
}