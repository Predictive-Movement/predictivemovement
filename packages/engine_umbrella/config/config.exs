import Config

config :engine, Adapters.RMQ, Engine.Adapters.RMQ
config :engine, :rmq_producer, BroadwayRabbitMQ.Producer

config :engine, :outgoing_vehicle_exchange, "outgoing_transport_updates"
config :engine, :incoming_vehicle_exchange, "incoming_transport_updates"
config :engine, :outgoing_booking_exchange, "outgoing_booking_updates"
config :engine, :incoming_booking_exchange, "incoming_booking_updates"
config :engine, :outgoing_plan_exchange, "outgoing_plan_updates"

config :engine, event_stores: [Engine.ES]

config :engine, Engine.ES,
  serializer: Engine.JsonSerializer,
  username: System.get_env("POSTGRES_USER") || "postgres",
  password: System.get_env("POSTGRES_PASSWORD") || "postgres",
  database: System.get_env("POSTGRES_DB") || "eventstore",
  hostname: System.get_env("POSTGRES_HOST") || "localhost"

if Mix.env() == :test, do: import_config("test.exs")
