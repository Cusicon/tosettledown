module['exports'] = {

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default filesystem disk that should be used
    | by the framework. The "local" disk, as well as a variety of cloud
    | based disks are available to your application. Just store away!
    |
    */

    'default' : get_env('FILESYSTEM_DRIVER', 'local'),

    /*
    |--------------------------------------------------------------------------
    | Default Cloud Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Many applications store files both locally and in the cloud. For this
    | reason, you may specify a default "cloud" driver here. This driver
    | will be bound as the Cloud disk implementation in the container.
    |
    */

    'cloud' : get_env('FILESYSTEM_CLOUD', 's3'),

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | Here you may configure as many filesystem "disks" as you wish, and you
    | may even configure multiple disks of the same driver. Defaults have
    | been setup for each driver as an example of the required options.
    |
    | Supported Drivers: "local", "s3"
    |
    */

    'disks' :{
        'local' : {
            'driver' : 'local',
            'root' : storage_path(),
        },

        'public' : {
            'driver' : 'local',
            'root' : public_path('store'),
            'url' : `${get_env('APP_URL')}/store`,
            'visibility' : 'public',
        },

        's3' : {
            'driver' : 's3',
            'key' : get_env('AWS_ACCESS_KEY_ID'),
            'secret' : get_env('AWS_SECRET_ACCESS_KEY'),
            'region' : get_env('AWS_DEFAULT_REGION'),
            'bucket' : get_env('AWS_BUCKET'),
            'url' : get_env('AWS_URL'),
        },

    }
}
































