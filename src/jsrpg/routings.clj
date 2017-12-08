(ns jsrpg.routings
  (:require [compojure.api.sweet :as sweet]
            [compojure.api.resource :as resource]
            [compojure.api.core :as api]
            [schema.core :as s]
            [ring.util.http-response :as http]
            [ring.util.response :as resp]
            [cheshire.generate :refer [add-encoder]]
            [compojure.route :as route]
            [clojure.string :as string]))

(defn sub-key [str-fn]
  (fn [arg]
    (cond (keyword? arg) (str "state." (name arg))
          (string? arg) (str-fn arg)
          :else (str arg))))

(defn operation [operator str-fn]
  (fn [& args]
    (apply str (interpose (str " " operator " ") (map (sub-key str-fn) args)))))

(defn math-op [operator]
  (operation operator str))

(def fn-map {'+ (math-op "+")
             '- (math-op "-")
             '* (math-op "*")
             '< (math-op "<")
             '> (math-op ">")
             '| (math-op "||")
             '& (math-op "&&")
             '$ (operation "+" #(str "\"" % "\""))
             'd100 (fn [] "d100()")
             'd10 (fn [] "d10()")
             '$#!+ (fn [msg] (str "throwException('" msg "')"))
             '?= (fn [arg]
                   (str "state." (name arg) "?true:false"))
             '!?= (fn [arg]
                   (str "state." (name arg) "?false:true"))})

(defn encode-list [l]
  (println (first l))
  (println (rest l))
  (let [func (fn-map (first l))
        args (mapv (fn [arg]
                    (cond (list? arg) (encode-list arg)
                          :else arg))
                  (rest l))]
    (str "(" (apply func args) ")")))

(add-encoder clojure.lang.PersistentList
             (fn [l jg]
               (.writeString jg (str "${" (encode-list l) "}"))))

(add-encoder clojure.lang.Keyword
             (fn [k jg]
               (.writeString jg (name k))))

(defn build-app []
  (sweet/routes
    (sweet/api {}
               (sweet/GET "/data" [] (http/ok (read-string (slurp "resources/were.edn"))))
               (sweet/GET "/" [] (resp/redirect "/index.html")))
    (route/resources "/")
    (route/not-found "404 Not Found")))
