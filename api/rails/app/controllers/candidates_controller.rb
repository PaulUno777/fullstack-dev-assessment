# frozen_string_literal: true

class CandidatesController < ApplicationController
  before_action :set_candidate, only: %i[show update]

  def index
    result = Candidates::ListQuery.call(list_params)
    render json: {
      data: Candidates::Serializer.many(result.records),
      meta: {
        page: result.page,
        per_page: result.per_page,
        total: result.total,
        total_pages: result.total_pages
      }
    }
  end

  def show
    render json: Candidates::Serializer.one(@candidate)
  end

  def update
    if candidate_params.key?(:reviewed) && !candidate_params.key?(:status)
      result = Candidates::MarkReviewed.call(
        candidate: @candidate,
        reviewed: candidate_params[:reviewed]
      )
      return render json: Candidates::Serializer.one(result.candidate) if result.ok?

      return render json: {
        errors: [ { code: result.error_code, message: I18n.t("candidates.errors.#{result.error_code}") } ]
      }, status: :unprocessable_entity
    end

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

  def bulk
    ids = Array(bulk_params[:ids])
    status = bulk_params[:status]

    if ids.empty? || status.blank?
      return render json: {
        errors: [ { code: "invalid_params", message: I18n.t("candidates.errors.invalid_params") } ]
      }, status: :unprocessable_entity
    end

    result = Candidates::BulkUpdateStatus.call(ids: ids, status: status)

    render json: {
      data: Candidates::Serializer.many(result.updated),
      meta: {
        updated: result.updated.length,
        failed: result.errors.length
      },
      errors: result.errors.map { |error|
        {
          id: error.id,
          code: error.code,
          message: I18n.t("candidates.errors.#{error.code}")
        }
      }
    }
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
    params.require(:candidate).permit(:status, :reviewed)
  end

  def bulk_params
    params.permit(:status, ids: [])
  end

  def list_params
    permitted = params.permit(:page, :per_page, :q, :sort, :direction)
    # Scalar, CSV, or array (`status[]=pending&status[]=rejected`)
    permitted[:status] = params[:status] if params.key?(:status)
    permitted
  end
end
