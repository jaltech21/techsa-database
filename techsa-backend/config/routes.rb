Rails.application.routes.draw do
  devise_for :members,
             path: "api/v1/members",
             controllers: {
               registrations: "api/v1/registrations",
               sessions:      "api/v1/sessions",
               passwords:     "api/v1/passwords"
             }

  namespace :api do
    namespace :v1 do
      get   "members/me",      to: "members#me"
      patch "members/profile", to: "api/v1/profiles#update"
      post  "passkeys/validate", to: "passkeys#validate"

      namespace :admin do
        resources :members,  only: %i[index update]
        resources :passkeys, only: %i[index create]
      end
    end
  end
end
