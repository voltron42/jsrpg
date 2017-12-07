(ns jsrpg.server
  (:require [org.httpkit.server :as http]
            [jsrpg.routings :as r]
            [environ.core :refer [env]])
  (:gen-class))

(defn -main [& [port]]
  (let [my-app (r/build-app)
        port (Integer. ^int (or port (env :port) 5000))]
    (http/run-server my-app {:port port :join? false})))