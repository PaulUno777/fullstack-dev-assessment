# frozen_string_literal: true

require "test_helper"

class CandidatesControllerTest < ActionDispatch::IntegrationTest
  setup do
    Candidate.delete_all
    @pending = Candidate.create!(
      name: "Alan Cruz",
      years_exp: 10,
      status: "pending",
      date_applied: Time.zone.parse("2018-06-05 11:55:42"),
      reviewed: false,
      description: "litigator"
    )
    @accepted = Candidate.create!(
      name: "Brian Patel",
      years_exp: 13,
      status: "accepted",
      date_applied: Time.zone.parse("2018-06-02 09:55:42"),
      reviewed: true,
      description: "seasoned"
    )
  end

  test "index returns json list" do
    get candidates_url, as: :json

    assert_response :success
    assert_equal "application/json; charset=utf-8", response.content_type
    body = JSON.parse(response.body)
    assert_equal 2, body["data"].length
  end

  test "show returns a candidate" do
    get candidate_url(@pending), as: :json

    assert_response :success
    body = JSON.parse(response.body)
    assert_equal @pending.id, body["id"]
    assert_equal "Alan Cruz", body["name"]
  end

  test "show returns 404 for missing candidate" do
    get candidate_url(id: 0), as: :json

    assert_response :not_found
    body = JSON.parse(response.body)
    assert_equal "not_found", body["errors"].first["code"]
  end

  test "update accepts pending candidate and sets reviewed" do
    patch candidate_url(@pending),
          params: { candidate: { status: "accepted" } },
          as: :json

    assert_response :success
    body = JSON.parse(response.body)
    assert_equal "accepted", body["status"]
    assert_equal true, body["reviewed"]
    assert_equal true, @pending.reload.reviewed
  end

  test "update rejects change on final status" do
    patch candidate_url(@accepted),
          params: { candidate: { status: "rejected" } },
          as: :json

    assert_response :unprocessable_entity
    body = JSON.parse(response.body)
    assert_equal "status_locked", body["errors"].first["code"]
  end
end
