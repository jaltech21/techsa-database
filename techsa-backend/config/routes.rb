Rails.application.routes.draw do
  devise_for :members,
             path: "api/v1/members",
             controllers: {
               registrations: "api/v1/registrations",
               sessions: "api/v1/sessions"
             }

  namespace :api do
    namespace :v1 do
      get "members/me", to: "members#me"

      namespace :admin do
        resources :members, only: %i[index update]
      end
    end
  end
end
