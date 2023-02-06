class OrganizationController < ApplicationController
  skip_before_action :verify_authenticity_token
  #Aqui cargaran las organizaciones
  def loadOrganizations
    organizations = Organization.loadOrganizations()
    render json: {status: "SUCCESS", data: organizations}
  end

end
