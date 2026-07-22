# frozen_string_literal: true

class CandidatesController < ApplicationController
  before_action :set_candidate, only: %i[show update]

  def index
    candidates = Candidate.order(date_applied: :desc)
    render json: { data: Candidates::Serializer.many(candidates) }
  end

  def show
    render json: Candidates::Serializer.one(@candidate)
  end

  def update
    result = Candidates::UpdateStatus.call(
      candidate: @candidate,
      status: candidate_params[:status]
    )

    if result.ok?
      render json: Candidates::Serializer.one(result.candidate)
    else
      render json: {
        errors: [ { code: result.error_code, message: I18n.t("candidates.errors.#{result.error_code}") } ]
      }, status: :unprocessable_entity
    end
  end

  private

  def set_candidate
    @candidate = Candidate.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: {
      errors: [ { code: "not_found", message: I18n.t("candidates.errors.not_found") } ]
    }, status: :not_found
  end

  def candidate_params
    params.require(:candidate).permit(:status)
  end
end
