use Mix.Releases.Config,
    default_release: :api,
    default_environment: :prod

environment :prod do
  set include_erts: true
  set include_src: false
  set include_system_libs: true
  set cookie: :"UHLs;22CbwNqpN?3g9`c|?.>XO;s%]yP0aup<SmL]`.8bAbujy1[%4.23%1Ya"
end

release :api do
  set version: current_version(:api)
  set commands: ["migrate": "rel/commands/migrate.sh"]
  set applications: [api: :permanent]
end